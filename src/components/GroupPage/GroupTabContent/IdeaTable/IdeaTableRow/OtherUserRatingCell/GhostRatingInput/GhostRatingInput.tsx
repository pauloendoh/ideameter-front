import { useCurrentGroup } from "@/hooks/domain/group/useCurrentGroup"
import { useMyGhostRatingsQuery } from "@/hooks/react-query/domain/group/ghost-rating/useMyGhostRatingsQuery"
import { Box } from "@mui/material"
import { useMemo } from "react"
import { DropdownGhostRatingInput } from "./DropdownGhostRatingInput/DropdownGhostRatingInput"
import { NumericGhostRatingInput } from "./NumericGhostRatingInput/NumericGhostRatingInput"

type Props = {
  groupId: string
  ideaId: string
  targetUserId: string
  theirRatingValue: number | null
}

export const GhostRatingInput = ({ ...props }: Props) => {
  const { data: myGhostRatings } = useMyGhostRatingsQuery({
    groupId: props.groupId,
  })

  const currentGroup = useCurrentGroup()

  const value = useMemo(() => {
    if (props.theirRatingValue) {
      return props.theirRatingValue
    }
    if (!myGhostRatings) {
      return null
    }

    const rating =
      myGhostRatings.find(
        (rating) =>
          rating.targetUserId === props.targetUserId &&
          rating.ideaId === props.ideaId
      )?.rating ?? null

    return rating
  }, [myGhostRatings, props.theirRatingValue])

  const content = useMemo(() => {
    if (!currentGroup?.id) {
      return null
    }
    if (currentGroup.ratingInputType === "dropdown") {
      return (
        <DropdownGhostRatingInput
          groupId={currentGroup.id}
          ideaId={props.ideaId}
          myCurrentRating={value}
          targetUserId={props.targetUserId}
        />
      )
    }
    return (
      <NumericGhostRatingInput
        ideaId={props.ideaId}
        myCurrentRating={value}
        targetUserId={props.targetUserId}
        groupId={currentGroup.id}
      />
    )
  }, [currentGroup, value])

  return <Box className={`GhostRatingInput`}>{content}</Box>
}
