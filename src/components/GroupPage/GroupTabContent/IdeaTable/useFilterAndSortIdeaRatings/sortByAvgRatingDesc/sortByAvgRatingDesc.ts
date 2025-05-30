import { IdeaTableItem } from "@/hooks/react-query/domain/group/useIdeaTableItemsQueryUtils"

export const sortByAvgRatingDesc = (ideaRatings: IdeaTableItem[]) => {
  return ideaRatings.sort((a, b) => {
    const numRatingA = Number(a.avgRating)
    const numRatingB = Number(b.avgRating)
    // if both ideas have same avg rating, it will sort by ratings count
    if (numRatingA === numRatingB) {
      const youRatedIdeaA = a.yourRating ? 1 : 0
      const ratingsCountA =
        youRatedIdeaA + a.otherUserGroupRatings.filter((r) => r.rating).length

      const youRatedIdeaB = b.yourRating ? 1 : 0
      const ratingsCountB =
        youRatedIdeaB + b.otherUserGroupRatings.filter((r) => r.rating).length

      // if both ideas have same avg rating and same ratings count, it will sort by quick return votes count
      if (ratingsCountA === ratingsCountB) {
        return a.idea.highImpactVotes?.length > b.idea.highImpactVotes?.length
          ? -1
          : 1
      }

      return ratingsCountA > ratingsCountB ? -1 : 1
    }

    return numRatingA > numRatingB ? -1 : 1
  })
}
