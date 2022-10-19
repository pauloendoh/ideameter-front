import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useRatingsQuery"
import useTabIdeasQuery from "@/hooks/react-query/domain/group/tab/idea/useTabIdeasQuery"
import useSubideasQuery from "@/hooks/react-query/domain/subidea/useSubideasQuery"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import TabDto from "@/types/domain/group/tab/TabDto"
import urls from "@/utils/urls"
import { Badge, Tab, Typography } from "@mui/material"
import Link from "next/link"
import { useMemo } from "react"
import TabMenuOptions from "./TabMenuOptions/TabMenuOptions"

interface Props {
  groupId: string
  tab: TabDto
}

const GroupTabItem = (props: Props) => {
  const { authUser } = useAuthStore()
  const { data: groupRatings } = useRatingsQuery(props.groupId)
  const { data: tabIdeas } = useTabIdeasQuery({
    tabId: props.tab.id,
    groupId: props.groupId,
  })

  const { data: subideas } = useSubideasQuery(props.groupId)

  const groupIdeaParentIds = useMemo(() => {
    if (!subideas) return []
    return subideas?.reduce<string[]>((result, subidea) => {
      if (!result.includes(String(subidea.parentId)))
        return [...result, String(subidea.parentId)]
      return result
    }, [])
  }, [])

  // PE 1/3 - ?
  const userMustRateCount = useMemo(() => {
    if (!groupRatings || !tabIdeas) return 0

    const userRatedIdeaIds = groupRatings
      .filter((rating) => rating.userId === authUser?.id)
      .map((r) => r.ideaId)

    const ideasWithoutSubideas = tabIdeas.filter(
      (i) => !groupIdeaParentIds.includes(i.id)
    )

    const ideasUserMustRate = ideasWithoutSubideas.filter(
      (i) => !userRatedIdeaIds.includes(i.id)
    )

    // =====

    const tabIdeasIds = tabIdeas.filter((i) => !i.isDone).map((i) => i.id)
    const tabSubideas =
      subideas
        ?.filter((si) => tabIdeasIds.includes(String(si.parentId)))
        .filter((si) => !si.isDone) || []
    const subideasUserMustRate = tabSubideas.filter(
      (si) => !userRatedIdeaIds.includes(si.id)
    )

    console.log({
      ideas: ideasUserMustRate.length,
      subideas: subideasUserMustRate.length,
    })
    return ideasUserMustRate.length + subideasUserMustRate.length
  }, [authUser, groupRatings, tabIdeas, groupIdeaParentIds, subideas])

  return (
    <Link href={urls.pages.groupTab(props.groupId, props.tab.id)}>
      <a style={{ color: "inherit", textDecoration: "none" }}>
        <Tab
          key={props.tab.id}
          title={props.tab.name}
          sx={{
            maxWidth: {
              xs: 100,
              md: 150,
              lg: 200,
            },
          }}
          label={
            <Badge
              color="error"
              overlap="rectangular"
              badgeContent={userMustRateCount}
              componentsProps={{
                badge: {
                  title: `You have ${userMustRateCount} ideas to rate`,
                },
              }}
            >
              <FlexVCenter gap={0.5}>
                <TabMenuOptions tab={props.tab} />
                <Typography
                  noWrap
                  sx={{
                    maxWidth: {
                      xs: 100 - 48,
                      md: 150 - 48,
                      lg: 200 - 48,
                    },
                    fontSize: 14,
                  }}
                >
                  {props.tab.name}
                </Typography>
              </FlexVCenter>
            </Badge>
          }
        />
      </a>
    </Link>
  )
}

export default GroupTabItem
