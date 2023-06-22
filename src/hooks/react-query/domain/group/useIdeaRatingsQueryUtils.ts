import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import UserGroupDto from "@/types/domain/group/UserGroupDto"
import IdeaDto, { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import { useCallback, useMemo } from "react"
import useOtherMembersQueryUtils from "../group-members/useOtherMembersQueryUtils"
import useSubideasQuery from "../subidea/useSubideasQuery"
import useRatingsQuery from "./tab/idea/rating/useRatingsQuery"
import useTabIdeasQuery from "./tab/idea/useTabIdeasQuery"

export interface OtherUserGroupRating {
  userGroup: UserGroupDto
  rating: number | null
}
export interface IdeaRating {
  idea: IdeaDto
  subideas: IdeaDto[]
  avgRating: number | null
  yourRating: number | null | undefined
  otherUserGroupRatings: OtherUserGroupRating[]
}

const useIdeaRatingsQueryUtils = (groupId: string, tabId: string) => {
  const { authUser } = useAuthStore()
  const { data: subideas } = useSubideasQuery(groupId)
  const otherMembers = useOtherMembersQueryUtils(groupId)
  const { data: groupRatings } = useRatingsQuery(groupId)
  const { data: tabIdeas } = useTabIdeasQuery({ groupId, tabId })

  // const selectedLabelIds = useGroupFilterStore(
  //   (state) => state.filter.labelIds
  // );

  const getAvgIdeaRating = useCallback(
    (ideaId: string) => {
      if (!groupRatings) return null
      const ideaRatings = groupRatings.filter((r) => r.ideaId === ideaId)
      if (ideaRatings.length === 0) return null

      const validRatings = ideaRatings.filter((r) => r.rating && r.rating > 0)
      const sum = validRatings.reduce(
        (partialSum, r) => partialSum + (r.rating || 0),
        0
      )

      if (sum === 0) return null
      return sum / validRatings.length
    },
    [groupRatings]
  )

  const ideaRatings = useMemo(() => {
    if (!tabIdeas || !groupRatings || !authUser) return []

    let results: IdeaRating[] = tabIdeas.map((idea) => ({
      idea,
      subideas: subideas?.filter((s) => s.parentId === idea.id) || [],
      yourRating:
        groupRatings.find(
          (gr) => gr.userId === authUser.id && gr.ideaId === idea.id
        )?.rating || null,
      avgRating: getAvgIdeaRating(idea.id),
      otherUserGroupRatings: otherMembers.map((member) => ({
        userGroup: member,
        rating:
          groupRatings.find(
            (rating) =>
              rating.userId === member.user?.id && rating.ideaId === idea.id
          )?.rating || null,
      })),
    }))

    return results
  }, [
    authUser,
    tabIdeas,
    tabIdeas?.map((i) => i.highImpactVotes),
    subideas,
    otherMembers,
    groupRatings,
  ])

  return ideaRatings
}

export default useIdeaRatingsQueryUtils

export const buildIdeaRating = (p?: Partial<IdeaRating>): IdeaRating => ({
  idea: buildIdeaDto(),
  subideas: [],
  avgRating: null,
  yourRating: null,
  otherUserGroupRatings: [],
  ...p,
})
