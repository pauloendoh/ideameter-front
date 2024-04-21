import useHighlyRatedIdeasByMeQuery from "@/hooks/react-query/domain/idea/useHighlyRatedIdeasByMeQuery"
import useUserSettingsQuery from "@/hooks/react-query/domain/user-settings/useIdeaChangesQuery"
import useHideTabsDialogStore from "@/hooks/zustand/dialogs/useHideTabsDialogStore"
import { Box, Button, Container, Tab, Tabs, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import FlexCol from "../_common/flexboxes/FlexCol"
import FlexVCenter from "../_common/flexboxes/FlexVCenter"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import MyRatingItem from "./MyRatingItem/MyRatingItem"

const MyRatingsPage = () => {
  const { data } = useHighlyRatedIdeasByMeQuery()

  const [tab, setTab] = useState<"would now" | "archived" | "completed">()

  const { data: userSettings } = useUserSettingsQuery()

  const tabIndex = useMemo(() => {
    if (tab === "would now") return 0
    if (tab === "completed") return 1
    if (tab === "archived") return 2
    return 0
  }, [tab])

  const selectedItems = useMemo(() => {
    if (tab === "archived") {
      return data?.filter((item) => item.idea.isArchived)
    }
    if (tab === "completed") {
      return data?.filter((item) => item.idea.isDone)
    }
    return data
      ?.filter((item) => !item.idea.isDone)
      ?.filter((item) => {
        if (userSettings?.hiddenTabsIds.includes(item.tab.tabId)) return false
        return true
      })
      .sort((a, b) => {
        if (a.myRating.position === null) return 1
        if (b.myRating.position === null) return -1
        return a.myRating.position - b.myRating.position
      })
  }, [data, tab, userSettings])

  const selectedItemwWithPosition = useMemo(() => {
    return (
      selectedItems?.filter((item) => item.myRating.position !== null) ?? []
    )
  }, [selectedItems])

  const selectedItemwWithoutPosition = useMemo(() => {
    return (
      selectedItems?.filter((item) => item.myRating.position === null) ?? []
    )
  }, [selectedItems])

  const { openDialog } = useHideTabsDialogStore()

  return (
    <HomeLayout>
      <Container
        maxWidth="md"
        sx={{ mt: 4, alignItems: "center", justifyContent: "center" }}
      >
        <Typography variant="h5">My ratings</Typography>

        <Box>
          <Tabs
            value={tabIndex}
            onChange={(e, value) => {
              if (value === 0) {
                setTab("would now")
              }
              if (value === 1) {
                setTab("completed")
              }
              if (value === 2) {
                setTab("archived")
              }
            }}
            aria-label="basic tabs example"
          >
            <Tab label="Would now" />
            <Tab label="Completed" />
            <Tab label="Archived" />
          </Tabs>
        </Box>

        <FlexVCenter justifyContent={"space-between"}>
          <span></span>
          <Button onClick={() => openDialog()}>Hidden tabs</Button>
        </FlexVCenter>

        <FlexCol mt={4}>
          {selectedItemwWithPosition.map((assign, index) => (
            <MyRatingItem assign={assign} index={index} key={assign.idea.id} />
          ))}
        </FlexCol>

        <FlexCol mt={4}>
          {selectedItemwWithoutPosition.map((assign, index) => (
            <MyRatingItem assign={assign} index={index} key={assign.idea.id} />
          ))}
        </FlexCol>
      </Container>
    </HomeLayout>
  )
}

export default MyRatingsPage
