import useRatingsByGroupQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useRatingsByGroupQuery";
import useSaveRatingMutation from "@/hooks/react-query/domain/group/tab/idea/rating/useSaveRatingMutation";
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { newRatingDto } from "@/types/domain/group/tab/idea/rating/RatingDto";
import { MenuItem, Select } from "@mui/material";
import React, { useMemo } from "react";

interface Props {
  idea: IdeaDto;
  groupId: string;
}

const RatingInput = (props: Props) => {
  const { authUser } = useAuthStore();
  const { data: groupRatings } = useRatingsByGroupQuery(props.groupId);
  const saveRatingMutation = useSaveRatingMutation();

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

  const handleChange = (newValue: number) => {
    if (newValue === -1) return;
    const valueToSave = newValue === 0 ? null : newValue;

    saveRatingMutation.mutate({
      payload: newRatingDto(props.idea.id, valueToSave),
      groupId: props.groupId,
    });
  };

  return (
    <Select
      size="small"
      value={currentRating}
      sx={{ width: 50 }}
      onChange={(e) => handleChange(e.target.value as number)}
    >
      {/* invisible character to avoid small height */}
      <MenuItem value={-1}>⠀</MenuItem>

      <MenuItem value={0}>-</MenuItem>
      <MenuItem value={3}>3</MenuItem>
      <MenuItem value={2}>2</MenuItem>
      <MenuItem value={1}>1</MenuItem>
    </Select>
  );
};

export default RatingInput;
