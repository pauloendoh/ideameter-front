import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import { IFilter } from "@/hooks/zustand/domain/group/useGroupFilterStore"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import { ISortOption } from "@/types/domain/idea/IdeaSortingTypes"
import { useMemo } from "react"
import { sortByAvgRatingDesc } from "./sortByAvgRatingDesc/sortByAvgRatingDesc"

type Params = {
  ratings: RatingDto[] | undefined
  ideaRatings: IdeaRating[]
  sortingBy: ISortOption
  ideaRequiresYourRating: (ideaId: string) => boolean
  authUserId: string
  filter: IFilter
  isSubideasTable?: boolean
}

export const useFilterAndSortIdeaRatings = ({
  ratings,
  ideaRatings,
  sortingBy,
  ideaRequiresYourRating,
  authUserId,
  filter,
  isSubideasTable = false,
}: Params) => {
  const filteredAndSortedIdeaRatings = useMemo(() => {
    const {
      labelIds: selectedLabelIds,
      onlyCompletedIdeas,
      onlyHighImpactVoted,
      requiresYourRating,
      users: filteringUsers,
      minRatingCount,
      minAvgRating,
    } = filter

    let result = [...ideaRatings]

    result = result.filter((r) => {
      if (r.idea.parentId) return true // subideas must always appear
      if (onlyCompletedIdeas && !r.idea.isDone) return false
      if (!onlyCompletedIdeas && r.idea.isDone) return false

      if (filteringUsers.length > 0) {
        const filteringIds = filteringUsers.map((u) => u.id)
        const currentUserIds = r.idea.assignedUsers.map((u) => u.id)
        if (
          !filteringIds.every((filteringId) =>
            currentUserIds.includes(filteringId)
          )
        )
          return false
      }

      return true
    })

    if (isSubideasTable) {
      return sortByAvgRatingDesc(result)
    }

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
            if (subidea.isDone) return false
            const foundUserSubideaRating =
              ratings?.find(
                (r) => r.ideaId === subidea.id && r.userId === authUserId
              ) || null

            if (!foundUserSubideaRating) return true
          }
        }
        return false
      })
    }

    if (minRatingCount > 0) {
      result = result.filter((ideaRating) => {
        const youRated = ideaRating.yourRating && ideaRating.yourRating > 0
        const otherRatingsCount = ideaRating.otherUserGroupRatings.filter(
          (r) => r.rating && r.rating > 0
        ).length
        const total = otherRatingsCount + (youRated ? 1 : 0)
        return total >= minRatingCount
      })
    }

    if (minAvgRating > 0) {
      result = result.filter((ideaRating) => {
        return ideaRating.avgRating && ideaRating.avgRating >= minAvgRating
      })
    }

    if (sortingBy.attribute === "irrelevantSince")
      result = result.sort((a, b) =>
        String(b.idea.irrelevantSince || "").localeCompare(
          String(a.idea.irrelevantSince || "")
        )
      )

    if (sortingBy.attribute === "createdAt")
      result = result.sort((a, b) =>
        b.idea.createdAt.localeCompare(a.idea.createdAt)
      )

    if (sortingBy.attribute === "updatedAt")
      result = result.sort((a, b) =>
        b.idea.updatedAt.localeCompare(a.idea.updatedAt)
      )

    if (sortingBy.attribute === "avgRating") {
      result = sortByAvgRatingDesc(result)
    }

    if (sortingBy.attribute === "requiresYourRating") {
      result = result.sort((a, b) => {
        if (
          ideaRequiresYourRating(b.idea.id) &&
          !ideaRequiresYourRating(a.idea.id)
        )
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
