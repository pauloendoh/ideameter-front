import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useRatingsQuery"
import useTabIdeasQuery from "@/hooks/react-query/domain/group/tab/idea/useTabIdeasQuery"
import useSubideasQuery from "@/hooks/react-query/domain/subidea/useSubideasQuery"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import TabDto from "@/types/domain/group/tab/TabDto"
import { Badge, Typography } from "@mui/material"
import { HTMLAttributes, useMemo } from "react"

interface Props {
  tab: TabDto
  htmlProps: HTMLAttributes<HTMLLIElement>
}

const TabSelectorItem = ({ tab, htmlProps }: Props) => {
  const { data: tabIdeas } = useTabIdeasQuery({
    tabId: tab.id,
    groupId: tab.groupId,
  })

  const { authUser } = useAuthStore()

  const { data: groupRatings } = useRatingsQuery(tab.groupId)

  const { data: subideas } = useSubideasQuery(tab.groupId)

  const groupIdeaParentIds = useMemo(() => {
    if (!subideas) return []
    return subideas?.reduce<string[]>((result, subidea) => {
      if (!result.includes(String(subidea.parentId)))
        return [...result, String(subidea.parentId)]
      return result
    }, [])
  }, [])

  const userMustRateCount = useMemo(() => {
    if (!groupRatings || !tabIdeas) return 0

    const userRatedIdeaIds = groupRatings
      .filter((rating) => rating.userId === authUser?.id)
      .map((r) => r.ideaId)

    const ideasWithoutSubideas = tabIdeas
      .filter((i) => !groupIdeaParentIds.includes(i.id))
      .filter((i) => !i.isDone)

    const ideasUserMustRate = ideasWithoutSubideas.filter(
      (i) => !userRatedIdeaIds.includes(i.id)
    )

    // =====

    const tabIdeasIds = tabIdeas.map((i) => i.id)
    const tabSubideas =
      subideas
        ?.filter((si) => tabIdeasIds.includes(String(si.parentId)))
        .filter((si) => !si.isDone) || []
    const subideasUserMustRate = tabSubideas.filter(
      (si) => !userRatedIdeaIds.includes(si.id)
    )

    return ideasUserMustRate.length + subideasUserMustRate.length
  }, [authUser, groupRatings, tabIdeas, groupIdeaParentIds, subideas])

  return (
    <FlexVCenter {...(htmlProps as any)}>
      <FlexVCenter
        justifyContent="space-between"
        style={{ width: "100%" }}
        py={1}
      >
        <Typography>{tab.name}</Typography>

        <Badge
          sx={{ fontSize: 12 }}
          color="error"
          overlap="rectangular"
          badgeContent={userMustRateCount}
          componentsProps={{
            badge: {
              title: `You have ${userMustRateCount} ideas to rate`,
            },
          }}
        >
          <Typography>{tabIdeas?.length || 0}</Typography>
        </Badge>
      </FlexVCenter>
    </FlexVCenter>
  )
}

export default TabSelectorItem
