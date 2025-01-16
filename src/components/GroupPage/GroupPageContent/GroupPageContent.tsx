import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import HomeLayout from "@/components/layout/HomeLayout/HomeLayout"
import GroupMoreIcon from "@/components/layout/dialogs/GroupDialog/GroupMoreIcon/GroupMoreIcon"
import { useCheckAndRedirectLastOpenedGroup } from "@/hooks/domain/group/useCheckAndRedirectLastOpenedGroup"
import { useCurrentGroup } from "@/hooks/domain/group/useCurrentGroup"
import useGroupTabsQuery from "@/hooks/react-query/domain/group/tab/useGroupTabsQuery"
import { useGroupRelatedSockets } from "@/hooks/socket/domain/group/useGroupRelatedSockets"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useGroupInsightsDialogStore from "@/hooks/zustand/dialogs/useGroupInsightsDialogStore"
import useTabDialogStore from "@/hooks/zustand/dialogs/useTabDialogStore"
import useGroupFilterStore, {
  IStore,
  resetGroupFilterStore,
} from "@/hooks/zustand/domain/group/useGroupFilterStore"
import useSelectedIdeasStore from "@/hooks/zustand/domain/idea/useSelectedIdeasStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { buildTabDto } from "@/types/domain/group/tab/TabDto"
import { useAxios } from "@/utils/axios/useAxios"
import { cookieKeys } from "@/utils/cookieKeys"
import urls from "@/utils/urls"
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material"
import Head from "next/head"
import nookies from "nookies"
import { useEffect, useMemo } from "react"
import { MdAdd } from "react-icons/md"
import GroupTabContent from "../GroupTabContent/GroupTabContent"
import GroupTabs from "../GroupTabs/GroupTabs"
import SearchRow from "../SearchRow/SearchRow"
import SelectedIdeasOptionsRow from "../SelectedIdeasOptionsRow/SelectedIdeasOptionsRow"

interface Props {}

const GroupPageContent = (props: Props) => {
  const { openDialog } = useTabDialogStore()
  const { groupId, tabId } = useRouterQueryString()

  useGroupRelatedSockets(groupId)

  const setErrorMessage = useSnackbarStore((s) => s.setErrorMessage)
  const checkAndRedirectLastOpenedGroup = useCheckAndRedirectLastOpenedGroup()

  const selectedGroup = useCurrentGroup({
    onGroupNotFound: () => {
      setErrorMessage("Group not found. Redirecting to last opened group...")
      checkAndRedirectLastOpenedGroup()
    },
  })

  const { data: groupTabs } = useGroupTabsQuery(groupId)

  const selectedTab = useMemo(() => {
    if (!tabId || !groupTabs) return null
    return groupTabs.find((t) => t.id === tabId)
  }, [tabId, groupTabs])
  // oldest first
  const sortedGroupTabs = useMemo(
    () => groupTabs?.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)) || [],
    [groupTabs]
  )

  const axios = useAxios()

  const updateLastOpenedGroupId = (groupId: string) => {
    axios.put(urls.api.lastOpenedGroupId, { groupId })
  }

  useEffect(() => {
    resetGroupFilterStore()

    if (groupId) {
      updateLastOpenedGroupId(groupId) //
    }
  }, [groupId])

  useEffect(() => {
    if (tabId) {
      const cookieStr = nookies.get(null)[cookieKeys.groupTabIdeasFilter(tabId)]
      if (cookieStr) {
        const filterStore: IStore = JSON.parse(cookieStr)
        if (
          // you need to add here when you create new filters, so the cookie doesn't mess it up
          filterStore.filter.onlyCompletedIdeas !== undefined &&
          filterStore.filter.requiresYourRating !== undefined
        ) {
          useGroupFilterStore.setState(filterStore)
          return
        }
      }
    }
    resetGroupFilterStore()
  }, [tabId])

  const openGroupInsightsDialog = useGroupInsightsDialogStore(
    (s) => s.openDialog
  )

  const selectedIdeaIds = useSelectedIdeasStore((s) => s.selectedIdeaIds)

  const htmlTitle = useMemo(() => {
    if (selectedGroup && selectedTab)
      return `${selectedGroup.name} - ${selectedTab.name} - Ideameter`
    if (selectedGroup) return `${selectedGroup.name} - Ideameter`
    return "Ideameter"
  }, [selectedGroup, selectedTab])

  return (
    <HomeLayout>
      <Head>
        <title>{htmlTitle}</title>
      </Head>
      <Container>
        {groupId && selectedGroup && (
          <Box sx={{ mt: 1 }}>
            <FlexVCenter justifyContent="space-between">
              <FlexVCenter gap={1}>
                <Typography variant="h5">{selectedGroup.name}</Typography>
                <GroupMoreIcon
                  group={selectedGroup}
                  onAfterDelete={() => {}}
                  canEdit
                />
              </FlexVCenter>
              <Button onClick={() => openGroupInsightsDialog(selectedGroup)}>
                Insights
              </Button>
            </FlexVCenter>

            <Paper sx={{ mt: 2, width: "100%", background: "#2B2B2B" }}>
              <FlexVCenter
                sx={{ px: 1, pt: 1, pb: 2, justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tooltip
                    open={sortedGroupTabs.length === 0 ? true : undefined}
                    arrow
                    title="Add tab"
                  >
                    <IconButton
                      onClick={() => openDialog(buildTabDto({ groupId }))}
                    >
                      <MdAdd />
                    </IconButton>
                  </Tooltip>
                  <GroupTabs groupId={groupId} tabs={sortedGroupTabs} />
                </div>
              </FlexVCenter>

              {selectedIdeaIds.length > 0 ? (
                <SelectedIdeasOptionsRow
                  selectedIdeaIds={selectedIdeaIds}
                  tabId={tabId}
                />
              ) : (
                <SearchRow />
              )}

              {tabId && groupId && (
                <GroupTabContent tabId={tabId} groupId={groupId} />
              )}
            </Paper>
          </Box>
        )}
      </Container>
    </HomeLayout>
  )
}

export default GroupPageContent
