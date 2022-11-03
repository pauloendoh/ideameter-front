import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import { IFilter } from "@/hooks/zustand/domain/group/useGroupFilterStore"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import { ISortOption } from "@/types/domain/idea/IdeaSortingTypes"
import { useMemo } from "react"

type Params = {
  ratings: RatingDto[] | undefined
  ideaRatings: IdeaRating[]
  sortingBy: ISortOption
  ideaRequiresYourRating: (ideaId: string) => boolean
  authUserId: string
  filter: IFilter
}

export const useFilterAndSortIdeaRatings = ({
  ratings,
  ideaRatings,
  sortingBy,
  ideaRequiresYourRating,
  authUserId,
  filter,
}: Params) => {
  const filteredAndSortedIdeaRatings = useMemo(() => {
    const {
      labelIds: selectedLabelIds,
      onlyCompletedIdeas,
      onlyHighImpactVoted,
      requiresYourRating,
      users: filteringUsers,
    } = filter

    let result = [...ideaRatings]

    result = result.filter((r) => {
      if (r.idea.parentId) return true // subideas must always appear
      if (onlyCompletedIdeas && !r.idea.isDone) return false
      if (!onlyCompletedIdeas && r.idea.isDone) return false

      if (filteringUsers.length > 0) {
        const filteringIds = filteringUsers.map((u) => u.id)
        const currentUserIds = r.idea.assignedUsers.map((u) => u.id)
        if (!filteringIds.every((filteringId) => currentUserIds.includes(filteringId)))
          return false
      }

      return true
    })

    if (onlyHighImpactVoted)
      result = result.filter(
        (r) => r.idea.parentId || r.idea.highImpactVotes?.length > 0 // subideas must always appear in their table
      )

    if (requiresYourRating) {
      result = result.filter((ideaRating) => {
        if (!ideaRating.idea.isDone) {
          const foundUserIdeaRating =
            ratings?.find(
              (r) => r.ideaId === ideaRating.idea.id && r.userId === authUserId
            ) || null
          if (!foundUserIdeaRating) return true

          for (const subidea of ideaRating.subideas) {
            const foundUserSubideaRating =
              ratings?.find((r) => r.ideaId === subidea.id && r.userId === authUserId) ||
              null

            if (!foundUserSubideaRating) return true
          }
        }
        return false
      })
    }

    if (sortingBy.attribute === "irrelevantSince")
      result = result.sort((a, b) =>
        String(b.idea.irrelevantSince || "").localeCompare(
          String(a.idea.irrelevantSince || "")
        )
      )

    if (sortingBy.attribute === "createdAt")
      result = result.sort((a, b) => b.idea.createdAt.localeCompare(a.idea.createdAt))

    if (sortingBy.attribute === "updatedAt")
      result = result.sort((a, b) => b.idea.updatedAt.localeCompare(a.idea.updatedAt))

    if (sortingBy.attribute === "avgRating") {
      result = result.sort((a, b) => {
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

          // if both ideas have same avg rating and same ratings count, it will sort by high impact votes count
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

    if (sortingBy.attribute === "requiresYourRating") {
      result = result.sort((a, b) => {
        if (ideaRequiresYourRating(b.idea.id) && !ideaRequiresYourRating(a.idea.id))
          return 1

        return -1
      })
    }

    if (sortingBy.attribute === "completedAt")
      result = result.sort((a, b) => {
        if (!a.idea.completedAt && !b.idea.completedAt) return 1
        if (!b.idea.completedAt) return -1
        if (!a.idea.completedAt) return 1

        return b.idea.completedAt.localeCompare(a.idea.completedAt)
      })

    if (selectedLabelIds.length > 0)
      result = result.filter((r) => {
        const labelIds = r.idea.labels.map((l) => l.id)
        return selectedLabelIds.every((id) => labelIds.includes(id))
      })

    return result
  }, [ratings, ideaRatings, sortingBy, ideaRequiresYourRating, filter])

  return filteredAndSortedIdeaRatings
}
