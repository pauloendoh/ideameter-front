import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useCurrentGroup } from "@/hooks/domain/group/useCurrentGroup"
import useDeleteRatingMutation from "@/hooks/react-query/domain/group/tab/idea/rating/useDeleteRatingMutation"
import useRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useRatingsQuery"
import useSaveRatingMutation from "@/hooks/react-query/domain/group/tab/idea/rating/useSaveRatingMutation"
import useRefreshRatingMutation from "@/hooks/react-query/domain/rating/useRefreshRatingMutation"
import useSubideasQuery from "@/hooks/react-query/domain/subidea/useSubideasQuery"
import { useRateYourInterestDialogStore } from "@/hooks/zustand/dialogs/useRateYourInterestDialogStore"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { Badge } from "@mui/material"
import { useMemo } from "react"
import DisabledRatingsIcon from "./DisabledRatingsIcon/DisabledRatingsIcon"
import { DropdownRatingInput } from "./DropdownRatingInput/DropdownRatingInput"
import { NumericRatingInputButton } from "./NumericRatingInputButton/NumericRatingInputButton"

interface Props {
  idea: IdeaDto
  groupId: string
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
    props.idea.isDone || myCurrentRating >= 0 || props.isDisabled

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
      groupId: props.groupId,
      ideaId: props.idea.id,
      rating: newValue === 0 ? null : newValue,
    })
  }

  const currentGroup = useCurrentGroup()

  const { openDialog: openRateYourInterestDialog } =
    useRateYourInterestDialogStore()

  if (!currentGroup) {
    return null
  }

  return (
    <Badge color="error" variant={hideBadge ? "standard" : "dot"}>
      {props.isDisabled ? (
        <FlexVCenter sx={{ width: 64, justifyContent: "center" }}>
          <DisabledRatingsIcon />
        </FlexVCenter>
      ) : currentGroup.ratingInputType === "dropdown" ? (
        <DropdownRatingInput
          handleChange={handleChange}
          isLoading={isLoading}
          isDisabled={props.isDisabled}
          myCurrentRating={myCurrentRating}
        />
      ) : (
        <NumericRatingInputButton
          groupId={props.groupId}
          handleChange={handleChange}
          idea={props.idea}
          myCurrentRating={myCurrentRating}
        />
      )}
    </Badge>
  )
}

export default RatingInput
