import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import { useCallback, useMemo } from "react"
import useOtherMembersQueryUtils from "../group-members/useOtherMembersQueryUtils"
import { useGroupRatingsWithGhostQueryUtils } from "../group/ghost-rating/useGroupRatingsWithGhostsQueryUtils"
import useRatingsQuery from "../group/tab/idea/rating/useRatingsQuery"
import { IdeaTableItem } from "../group/useIdeaTableItemsQueryUtils"
import useSubideasQueryUtils from "../subidea/useSubideasQueryUtils"

const useSubideaRatingsQueryUtils = (parentId: string, groupId: string) => {
  const { authUser } = useAuthStore()
  const { data: ratings, isLoading: loadingRatings } = useRatingsQuery(groupId)
  const filter = useGroupFilterStore((s) => s.filter)

  const otherMembers = useOtherMembersQueryUtils(groupId)

  const { data: subideas, isLoading: loadingSubideas } = useSubideasQueryUtils({
    groupId,
    ideaId: parentId,
  })

  const isLoading = loadingSubideas || loadingRatings

  const groupRatingsWithGhosts = useGroupRatingsWithGhostQueryUtils(groupId)

  const getAvgIdeaRating = useCallback(
    (subideaId: string) => {
      if (!groupRatingsWithGhosts) {
        return null
      }
      const subideaRatings = groupRatingsWithGhosts.filter(
        (r) => r.ideaId === subideaId
      )
      if (subideaRatings.length === 0) {
        return null
      }

      const validRatings = subideaRatings
        .filter((r) => r.rating && r.rating > 0)
        .filter(
          (r) =>
            filter.onlyShowRatingsByMemberIds.length === 0 ||
            filter.onlyShowRatingsByMemberIds.includes(r.userId)
        )

      const sum = validRatings.reduce(
        (partialSum, r) => partialSum + (r.rating ?? 0),
        0
      )

      if (sum === 0) {
        return null
      }
      return sum / validRatings.length
    },
    [groupRatingsWithGhosts, filter]
  )

  const ideaRatings = useMemo(() => {
    if (!subideas || !ratings || !authUser) return []

    const results: IdeaTableItem[] = subideas.map((idea) => ({
      idea,
      subideas: [],
      yourRating: ratings.find(
        (r) => r.userId === authUser.id && r.ideaId === idea.id
      )?.rating,
      avgRating: getAvgIdeaRating(idea.id),
      otherUserGroupRatings: otherMembers.map((member) => ({
        userGroup: member,
        rating:
          ratings.find(
            (rating) =>
              rating.userId === member.user?.id && rating.ideaId === idea.id
          )?.rating || null,
      })),
    }))

    return results
  }, [authUser, subideas, otherMembers, ratings, groupRatingsWithGhosts])

  return { data: ideaRatings, isLoading }
}

export default useSubideaRatingsQueryUtils
