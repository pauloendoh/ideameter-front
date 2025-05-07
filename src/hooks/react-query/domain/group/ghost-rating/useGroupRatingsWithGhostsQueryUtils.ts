import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import { useMemo } from "react"
import useRatingsQuery from "../tab/idea/rating/useRatingsQuery"
import { useMyGhostRatingsQuery } from "./useMyGhostRatingsQuery"

export const useGroupRatingsWithGhostQueryUtils = (groupId: string) => {
  const { data: groupRatings } = useRatingsQuery(groupId)
  const { data: myGhostRatings } = useMyGhostRatingsQuery({ groupId })
  const filter = useGroupFilterStore((s) => s.filter)

  const groupRatingsWithGhosts = useMemo(() => {
    if (!groupRatings) return []

    if (!filter.onlyGhostRatings) {
      return [...groupRatings]
    }

    const newGroupRatings = (myGhostRatings ?? [])
      .filter((ghostRating) => {
        const userRatingAlreadyExists = groupRatings.find(
          (gr) =>
            gr.ideaId === ghostRating.ideaId &&
            gr.userId === ghostRating.targetUserId
        )

        return !userRatingAlreadyExists
      })
      .map(
        (gr) =>
          ({
            userId: gr.targetUserId,
            ideaId: gr.ideaId,
            rating: gr.rating,
          } as RatingDto)
      )

    return [...groupRatings, ...newGroupRatings]
  }, [groupRatings, filter.onlyGhostRatings, myGhostRatings])

  return groupRatingsWithGhosts
}
