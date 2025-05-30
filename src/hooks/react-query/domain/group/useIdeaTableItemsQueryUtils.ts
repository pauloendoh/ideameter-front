import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import UserGroupDto from "@/types/domain/group/UserGroupDto"
import IdeaDto, { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import { useCallback, useMemo } from "react"
import useOtherMembersQueryUtils from "../group-members/useOtherMembersQueryUtils"
import useSubideasQuery from "../subidea/useSubideasQuery"
import { useGroupRatingsWithGhostQueryUtils } from "./ghost-rating/useGroupRatingsWithGhostsQueryUtils"
import useRatingsQuery from "./tab/idea/rating/useRatingsQuery"
import useTabIdeasQuery from "./tab/idea/useTabIdeasQuery"

export interface OtherUserGroupRating {
  userGroup: UserGroupDto
  rating: number | null
}
export interface IdeaTableItem {
  idea: IdeaDto
  subideas: IdeaDto[]
  avgRating: number | null
  yourRating: number | null | undefined
  otherUserGroupRatings: OtherUserGroupRating[]
}

const useIdeaTableItemsQueryUtils = (groupId: string, tabId: string) => {
  const authUserId = useAuthStore((s) => s.authUserId)
  const { data: subideas } = useSubideasQuery(groupId)
  const otherMembers = useOtherMembersQueryUtils(groupId)
  const { data: groupRatings } = useRatingsQuery(groupId)
  const { data: tabIdeas } = useTabIdeasQuery({ groupId, tabId })

  const groupRatingsWithGhosts = useGroupRatingsWithGhostQueryUtils(groupId)
  const filter = useGroupFilterStore((s) => s.filter)

  const getAvgIdeaRating = useCallback(
    (ideaId: string) => {
      if (!groupRatingsWithGhosts) {
        return null
      }
      const ideaRatings = groupRatingsWithGhosts.filter(
        (r) => r.ideaId === ideaId
      )
      if (ideaRatings.length === 0) return null

      const validRatings = ideaRatings
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
    if (!tabIdeas || !groupRatings || !authUserId) return []

    let results: IdeaTableItem[] = tabIdeas.map((idea) => ({
      idea,
      subideas: subideas?.filter((s) => s.parentId === idea.id) || [],
      yourRating:
        groupRatings.find(
          (gr) => gr.userId === authUserId && gr.ideaId === idea.id
        )?.rating ?? null,
      avgRating: getAvgIdeaRating(idea.id),
      otherUserGroupRatings: otherMembers.map((member) => ({
        userGroup: member,
        rating:
          groupRatings.find(
            (rating) =>
              rating.userId === member.user?.id && rating.ideaId === idea.id
          )?.rating ?? null,
      })),
    }))

    return results
  }, [
    authUserId,
    tabIdeas,
    tabIdeas?.map((i) => i.highImpactVotes),
    subideas,
    otherMembers,
    groupRatings,
    groupRatingsWithGhosts,
  ])

  return ideaRatings
}

export default useIdeaTableItemsQueryUtils

export const buildIdeaRating = (p?: Partial<IdeaTableItem>): IdeaTableItem => ({
  idea: buildIdeaDto(),
  subideas: [],
  avgRating: null,
  yourRating: null,
  otherUserGroupRatings: [],
  ...p,
})
