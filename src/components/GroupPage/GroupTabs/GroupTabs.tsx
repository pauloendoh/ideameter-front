import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import TabDto from "@/types/domain/group/tab/TabDto"
import urls from "@/utils/urls"
import { Box } from "@mui/material"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import GroupTabItem from "./GroupTabItem/GroupTabItem"
import S from "./styles"

interface Props {
  groupId: string
  tabs: TabDto[]
}

const GroupTabs = (props: Props) => {
  const { authUser } = useAuthStore()
  const [tabIndex, setTabIndex] = useState(0)

  const router = useRouter()
  const { tabId: queryTabId, ideaId } = useRouterQueryString()

  useEffect(() => {
    if (queryTabId) {
      const index = props.tabs.findIndex((tab) => tab.id === queryTabId)
      if (index !== -1) setTabIndex(index)
      return
    }

    const firstTab = props.tabs[0]
    if (firstTab && !ideaId) {
      console.log("GroupTabs.tsx")
      router.push(urls.pages.groupTab(props.groupId, firstTab.id))
    }
  }, [queryTabId, props.tabs])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <Box
      sx={{
        maxWidth: {
          // https://mui.com/material-ui/customization/breakpoints/
          xs: 320,
          sm: 400,
          md: 700,
          lg: 1000,
        },
      }}
    >
      <S.Tabs
        value={tabIndex}
        onChange={handleChange}
        aria-label="basic tabs example"
        variant="scrollable"
        scrollButtons="auto"
      >
        {props.tabs.map((tab) => (
          <GroupTabItem key={tab.id} groupId={props.groupId} tab={tab} />
        ))}
      </S.Tabs>
    </Box>
  )
}

export default GroupTabs
