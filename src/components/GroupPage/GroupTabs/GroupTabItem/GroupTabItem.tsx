import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import TabDto from "@/types/domain/group/tab/TabDto"
import urls from "@/utils/urls"
import { Badge, Tab, Typography } from "@mui/material"
import Link from "next/link"
import TabMenuOptions from "./TabMenuOptions/TabMenuOptions"
import { useTabRateCount } from "./useTabRateCount/useTabRateCount"

interface Props {
  groupId: string
  tab: TabDto
}

const GroupTabItem = (props: Props) => {
  const userMustRateCount = useTabRateCount({
    groupId: props.groupId,
    tabId: props.tab.id,
  })

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
