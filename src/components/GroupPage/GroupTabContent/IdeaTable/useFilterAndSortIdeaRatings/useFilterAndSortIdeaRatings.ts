import { calculateIdeaResult } from "@/components/AssignedIdeasPage/AssignedIdeasTableBody/AssignedIdeasTableRow/calculateIdeaResult/calculateIdeaResult"
import { IdeaTableItem } from "@/hooks/react-query/domain/group/useIdeaTableItemsQueryUtils"
import { IFilter } from "@/hooks/zustand/domain/group/useGroupFilterStore"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import { ISortOption } from "@/types/domain/idea/IdeaSortingTypes"
import { useMemo } from "react"
import { sortByAvgRatingDesc } from "./sortByAvgRatingDesc/sortByAvgRatingDesc"

type Params = {
  ratings: RatingDto[] | undefined
  ideaRatings: IdeaTableItem[]
  sortingBy: ISortOption
  ideaRequiresYourRating: (ideaId: string) => boolean
  authUserId: string
  filter: IFilter
  isSubideasTable?: boolean
}

// PE 1/3 - Oh my fking god
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
      excludeLabelIds,
      onlyCompletedIdeas,

      requiresYourRating,
      users: filteringUsers,
      minRatingCount,
      minAvgRating,
      votedHighImpactBy,
    } = filter

    let result = [...ideaRatings]

    result = result.filter((r) => {
      if (r.idea.isArchived) return false
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

    if (votedHighImpactBy) {
      result =
        votedHighImpactBy === "any"
          ? result.filter(
              (r) => r.idea.parentId ?? r.idea.highImpactVotes?.length > 0
            )
          : result.filter(
              (r) =>
                r.idea.parentId ??
                r.idea.highImpactVotes?.some(
                  (v) => v.userId === votedHighImpactBy
                )
            )
    }

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
      result = result.filter((tableItem) => {
        return tableItem.avgRating && tableItem.avgRating >= minAvgRating
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

    if (sortingBy.attribute === "experience") {
      result = result.sort((a, b) => {
        const resultA = calculateIdeaResult(a.idea)
        const resultB = calculateIdeaResult(b.idea)

        return resultB - resultA
      })
    }

    if (sortingBy.attribute === "rewarding") {
      result = result.sort((a, b) => {
        const isHighImpactA = a.idea.highImpactVotes?.some(
          (v) => v.userId === authUserId
        )
        const isHighImpactB = b.idea.highImpactVotes?.some(
          (v) => v.userId === authUserId
        )
        if (isHighImpactA && !isHighImpactB) {
          return -1
        }
        if (!isHighImpactA && isHighImpactB) {
          return 1
        }

        const rewardingA = a.idea.rewarding ?? 0
        const rewardingB = b.idea.rewarding ?? 0
        if (rewardingA === rewardingB) {
          const discomfortA = a.idea.discomfortZone ?? 0
          const discomfortB = b.idea.discomfortZone ?? 0

          return discomfortA - discomfortB
        }

        return rewardingB - rewardingA
      })
    }

    if (sortingBy.attribute === "updatedAt")
      result = result.sort((a, b) =>
        b.idea.updatedAt.localeCompare(a.idea.updatedAt)
      )

    if (sortingBy.attribute === "highVotedAt") {
      result = result.sort((a, b) => {
        const myVoteA =
          a.idea.highImpactVotes?.find((v) => v.userId === authUserId)
            ?.createdAt || ""
        const myVoteB =
          b.idea.highImpactVotes?.find((v) => v.userId === authUserId)
            ?.createdAt || ""

        return myVoteB.localeCompare(myVoteA)
      })
    }

    if (sortingBy.attribute === "avgRating") {
      result = sortByAvgRatingDesc(result)
    }

    if (sortingBy.attribute === "highImpactVotesCount") {
      result = result.sort((a, b) => {
        const aCount = a.idea.highImpactVotes?.length || 0
        const bCount = b.idea.highImpactVotes?.length || 0
        if (aCount === bCount) return 0
        return aCount > bCount ? -1 : 1
      })
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

    if (excludeLabelIds?.length > 0)
      result = result.filter((r) => {
        const labelIds = r.idea.labels.map((l) => l.id)
        return !excludeLabelIds.some((id) => labelIds.includes(id))
      })

    return result
  }, [ratings, ideaRatings, sortingBy, ideaRequiresYourRating, filter])

  return filteredAndSortedIdeaRatings
}
