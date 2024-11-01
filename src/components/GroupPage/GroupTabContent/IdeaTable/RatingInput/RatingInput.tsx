import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useDeleteRatingMutation from "@/hooks/react-query/domain/group/tab/idea/rating/useDeleteRatingMutation"
import useRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useRatingsQuery"
import useSaveRatingMutation from "@/hooks/react-query/domain/group/tab/idea/rating/useSaveRatingMutation"
import useRefreshRatingMutation from "@/hooks/react-query/domain/rating/useRefreshRatingMutation"
import useSubideasQuery from "@/hooks/react-query/domain/subidea/useSubideasQuery"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { newRatingDto } from "@/types/domain/group/tab/idea/rating/RatingDto"
import { Badge, NativeSelect } from "@mui/material"
import { useMemo } from "react"
import DisabledRatingsIcon from "./DisabledRatingsIcon/DisabledRatingsIcon"

interface Props {
  idea: IdeaDto
  groupId: string
  parentId?: string
  hideInput?: boolean
  isDisabled?: boolean
}

const RatingInput = (props: Props) => {
  const { authUser } = useAuthStore()
  const saveRatingMutation = useSaveRatingMutation()
  const deleteRatingMutation = useDeleteRatingMutation()
  const { data: groupRatings } = useRatingsQuery(props.groupId)

  const { data: subideas } = useSubideasQuery(props.groupId)

  const isLoading =
    saveRatingMutation.isLoading || deleteRatingMutation.isLoading

  const containsSubideas = useMemo(
    () => Boolean(subideas?.find((s) => s.parentId === props.idea.id)),
    [subideas]
  )

  const myCurrentRating = useMemo(() => {
    if (!groupRatings) return -1
    const userRating = groupRatings.find(
      (rating) =>
        rating.userId === authUser?.id && rating.ideaId === props.idea.id
    )

    if (containsSubideas && !userRating) return -1
    if (!userRating) return -1
    if (userRating.rating === null) return 0
    return userRating.rating
  }, [props.idea, groupRatings, containsSubideas])

  // I had to use currentRating -1 because MenuItem does not accept value={null}
  const hideBadge =
    props.idea.isDone ||
    myCurrentRating >= 0 ||
    containsSubideas ||
    props.isDisabled

  const { mutate: submitRefreshRating } = useRefreshRatingMutation()
  const { data: ratings } = useRatingsQuery(props.groupId)

  const handleChange = (newValue: number) => {
    if (newValue === -1) {
      deleteRatingMutation.mutate({
        ideaId: props.idea.id,
        groupId: props.groupId,
      })
      return
    }

    if (newValue === -2) {
      const rating = ratings?.find(
        (r) => r.ideaId === props.idea.id && r.userId === authUser?.id
      )
      if (rating) {
        submitRefreshRating(rating.id)
      }
      return
    }

    saveRatingMutation.mutate({
      payload: newRatingDto(props.idea.id, newValue),
      groupId: props.groupId,
      parentIdeaId: props.idea.parentId,
    })
  }

  return (
    <Badge color="error" variant={hideBadge ? "standard" : "dot"}>
      {props.isDisabled && <DisabledRatingsIcon />}

      {!props.isDisabled && props.hideInput ? (
        <FlexVCenter sx={{ width: 64, justifyContent: "center" }}>
          {myCurrentRating === 0 && "-"}
          {myCurrentRating > 0 && myCurrentRating}
        </FlexVCenter>
      ) : (
        <NativeSelect
          key={myCurrentRating}
          disabled={isLoading}
          variant="outlined"
          size="small"
          // value={currentRating}
          sx={{ width: 40, textAlignLast: "right" }}
          defaultValue={myCurrentRating}
          onChange={(e) => {
            handleChange(Number(e.target.value))
          }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {authUser?.username === "pauloendoh" && (
            <option value={-2}>Refresh</option>
          )}
          {/* invisible character to avoid small height */}
          <option value={-1}>⠀</option>
          <option value={0}>-</option>
          <option value={3}>3 - Very interesting</option>
          <option value={2}>2 - Kinda interesting</option>
          <option value={1}>1 - Not interesting</option>
        </NativeSelect>
      )}
    </Badge>
  )
}

export default RatingInput
