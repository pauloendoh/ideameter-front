import {
  IdeaRating,
  OtherUserGroupRating,
} from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import { TableCell } from "@mui/material"
import { useMemo } from "react"
import DisabledRatingsIcon from "../../RatingInput/DisabledRatingsIcon/DisabledRatingsIcon"
import { GhostRatingInput } from "./GhostRatingInput/GhostRatingInput"

type Props = {
  ideaRating: IdeaRating
  theirRating: OtherUserGroupRating
}

export const OtherUserRatingCell = ({ ...props }: Props) => {
  const { filter } = useGroupFilterStore()
  const hasSubideas = useMemo(
    () => props.ideaRating.subideas?.length > 0,
    [props.ideaRating.subideas]
  )

  const content = useMemo(() => {
    if (props.ideaRating.idea.ratingsAreEnabled === false) {
      return <DisabledRatingsIcon />
    }

    // if (hasSubideas && !props.theirRating.rating) {
    //   return "-"
    // }

    if (props.theirRating.rating) {
      return props.theirRating.rating
    }

    if (filter.onlyGhostRatings) {
      return (
        <GhostRatingInput
          groupId={props.theirRating.userGroup.groupId}
          targetUserId={props.theirRating.userGroup.userId}
          theirRatingValue={props.theirRating.rating}
          ideaId={props.ideaRating.idea.id}
        />
      )
    }

    return props.theirRating.rating
  }, [
    props.theirRating.rating,
    props.ideaRating.idea.ratingsAreEnabled,
    hasSubideas,
    filter.onlyGhostRatings,
  ])

  return <TableCell align="center">{content}</TableCell>
}
