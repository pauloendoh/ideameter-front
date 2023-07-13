import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { useCallback, useMemo } from "react"
import useOtherMembersQueryUtils from "../group-members/useOtherMembersQueryUtils"
import useRatingsQuery from "../group/tab/idea/rating/useRatingsQuery"
import { IdeaRating } from "../group/useIdeaRatingsQueryUtils"
import useSubideasQueryUtils from "../subidea/useSubideasQueryUtils"

const useSubideaRatingsQueryUtils = (parentId: string, groupId: string) => {
  const { authUser } = useAuthStore()
  const { data: ratings, isLoading: loadingRatings } = useRatingsQuery(groupId)

  const otherMembers = useOtherMembersQueryUtils(groupId)

  const { data: subideas, isLoading: loadingSubideas } = useSubideasQueryUtils({
    groupId,
    ideaId: parentId,
  })

  const isLoading = loadingSubideas || loadingRatings

  const getAvgIdeaRating = useCallback(
    (subideaId: string) => {
      if (!ratings) return null
      const ideaRatings = ratings.filter((r) => r.ideaId === subideaId)
      if (ideaRatings.length === 0) return null

      const validRatings = ideaRatings.filter((r) => r.rating && r.rating > 0)
      const sum = validRatings.reduce(
        (partialSum, r) => partialSum + (r.rating || 0),
        0
      )

      if (sum === 0) return null
      return sum / validRatings.length
    },
    [ratings]
  )

  const ideaRatings = useMemo(() => {
    if (!subideas || !ratings || !authUser) return []

    const results: IdeaRating[] = subideas.map((idea) => ({
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
  }, [authUser, subideas, otherMembers, ratings])

  return { data: ideaRatings, isLoading }
}

export default useSubideaRatingsQueryUtils
