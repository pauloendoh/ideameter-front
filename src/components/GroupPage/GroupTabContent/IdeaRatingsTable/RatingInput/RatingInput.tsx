import useDeleteRatingMutation from "@/hooks/react-query/domain/group/tab/idea/rating/useDeleteRatingMutation";
import useRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useRatingsQuery";
import useSaveRatingMutation from "@/hooks/react-query/domain/group/tab/idea/rating/useSaveRatingMutation";
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { newRatingDto } from "@/types/domain/group/tab/idea/rating/RatingDto";
import { Badge, MenuItem, Select } from "@mui/material";
import { useMemo } from "react";

interface Props {
  idea: IdeaDto;
  groupId: string;
  parentId?: string;
}

const RatingInput = (props: Props) => {
  const { authUser } = useAuthStore();
  const saveRatingMutation = useSaveRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();
  const { data: groupRatings } = useRatingsQuery(props.groupId, props.parentId);

  const isLoading =
    saveRatingMutation.isLoading || deleteRatingMutation.isLoading;

  const currentRating = useMemo(() => {
    if (!groupRatings) return -1;
    const userRating = groupRatings.find(
      (rating) =>
        rating.userId === authUser?.id && rating.ideaId === props.idea.id
    );

    if (!userRating) return -1;
    if (userRating.rating === null) return 0;
    return userRating.rating;
  }, [props.idea, groupRatings]);

  const shouldShowBadge = !props.idea.isDone && currentRating === -1;

  const handleChange = (newValue: number) => {
    if (newValue === -1) {
      deleteRatingMutation.mutate({
        ideaId: props.idea.id,
        groupId: props.groupId,
      });
      return;
    }

    const valueToSave = newValue === 0 ? null : newValue;

    saveRatingMutation.mutate({
      payload: newRatingDto(props.idea.id, valueToSave),
      groupId: props.groupId,
      parentIdeaId: props.idea.parentId,
    });
  };

  return (
    <Badge color="error" variant={shouldShowBadge ? "dot" : "standard"}>
      <Select
        disabled={isLoading}
        size="small"
        value={currentRating}
        sx={{ width: 56 }}
        onChange={(e) => {
          e.stopPropagation();
          handleChange(e.target.value as number);
        }}
        MenuProps={{
          onClick: (e) => e.stopPropagation(),
        }}
      >
        {/* invisible character to avoid small height */}
        <MenuItem value={-1}>⠀</MenuItem>
        <MenuItem value={0}>-</MenuItem>
        <MenuItem value={3}>3</MenuItem>
        <MenuItem value={2}>2</MenuItem>
        <MenuItem value={1}>1</MenuItem>
      </Select>
    </Badge>
  );
};

export default RatingInput;
