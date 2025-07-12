import useRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useRatingsQuery"
import useTabIdeasQuery from "@/hooks/react-query/domain/group/tab/idea/useTabIdeasQuery"
import useSubideasQuery from "@/hooks/react-query/domain/subidea/useSubideasQuery"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { useMemo } from "react"

export const useTabRateCount = (params: { tabId: string; groupId: string }) => {
  const { tabId, groupId } = params

  const { authUser } = useAuthStore()
  const { data: groupRatings } = useRatingsQuery(groupId)
  const { data: tabIdeas } = useTabIdeasQuery({
    tabId: tabId,
    groupId: groupId,
  })

  const { data: subideas } = useSubideasQuery(groupId)

  const groupIdeaParentIds = useMemo(() => {
    if (!subideas) return []
    return subideas?.reduce<string[]>((result, subidea) => {
      if (!result.includes(String(subidea.parentId)))
        return [...result, String(subidea.parentId)]
      return result
    }, [])
  }, [subideas])

  const tabRateCount = useMemo(() => {
    if (!groupRatings || !tabIdeas) {
      return 0
    }

    const userRatedIdeaIds = groupRatings
      .filter((rating) => rating.userId === authUser?.id)
      .map((r) => r.ideaId)

    const ideasWithoutSubideas = tabIdeas.filter(
      (i) => !groupIdeaParentIds.includes(i.id)
    )

    const ideasUserMustRate = ideasWithoutSubideas
      .filter((i) => !userRatedIdeaIds.includes(i.id))
      .filter((i) => !i.isDone)
      .filter((i) => !i.isArchived)
      .filter((i) => i.ratingsAreEnabled)

    const tabIdeasIds = tabIdeas.filter((i) => !i.isDone).map((i) => i.id)
    const tabSubideas =
      subideas
        ?.filter((si) => tabIdeasIds.includes(String(si.parentId)))
        .filter((si) => !si.isDone) || []
    const subideasUserMustRate = tabSubideas.filter(
      (si) => !userRatedIdeaIds.includes(si.id)
    )

    return ideasUserMustRate.length + subideasUserMustRate.length
  }, [authUser, groupRatings, tabIdeas, groupIdeaParentIds, subideas])

  return tabRateCount
}
