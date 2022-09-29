import GroupTabContent from "@/components/GroupPage/GroupTabContent/GroupTabContent"
import GroupTabs from "@/components/GroupPage/GroupTabs/GroupTabs"
import SearchRow from "@/components/GroupPage/SearchRow/SearchRow"
import GroupMoreIcon from "@/components/layout/dialogs/GroupDialog/GroupMoreIcon/GroupMoreIcon"
import HomeLayout from "@/components/layout/HomeLayout/HomeLayout"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useCheckAndRedirectLastOpenedGroup } from "@/hooks/domain/group/useCheckAndRedirectLastOpenedGroup"
import useGroupTabsQuery from "@/hooks/react-query/domain/group/tab/useGroupTabsQuery"
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery"
import { useGroupRelatedSockets } from "@/hooks/socket/domain/group/useGroupRelatedSockets"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useGroupInsightsDialogStore from "@/hooks/zustand/dialogs/useGroupInsightsDialogStore"
import useTabDialogStore from "@/hooks/zustand/dialogs/useTabDialogStore"
import useGroupFilterStore, {
  IGroupFilterStore,
  resetGroupFilterStore,
} from "@/hooks/zustand/domain/auth/group/useGroupFilterStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { newTabDto } from "@/types/domain/group/tab/TabDto"
import myAxios from "@/utils/axios/myAxios"
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
import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import nookies from "nookies"
import { useEffect, useMemo } from "react"
import { MdAdd } from "react-icons/md"

interface Props {
  linkPreview: { title: string; description: string } | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { ideaId } = context.query
  let linkPreview = null
  if (ideaId) {
    const res = await myAxios.get<{ title: string; description: string }>(
      urls.api.ideaName(String(ideaId))
    )
    if (res.data) linkPreview = res.data
  }
  return {
    props: {
      linkPreview,
    },
  }
}

const GroupId: NextPage<Props> = (props) => {
  const { data: groups } = useGroupsQuery()
  const { openDialog } = useTabDialogStore()
  const { groupId, tabId, ideaId } = useRouterQueryString()

  useGroupRelatedSockets(groupId)

  const setErrorMessage = useSnackbarStore((s) => s.setErrorMessage)
  const checkAndRedirectLastOpenedGroup = useCheckAndRedirectLastOpenedGroup()

  const selectedGroup = useMemo(() => {
    if (groupId) {
      const foundGroup = groups?.find((group) => group.id === groupId)

      if (groups && !foundGroup) {
        setErrorMessage("Group not found. Redirecting to last opened group...")
        checkAndRedirectLastOpenedGroup()
        return undefined
      }

      return foundGroup
    }

    return null
  }, [groups, groupId])

  const { data: groupTabs } = useGroupTabsQuery(groupId!)

  // oldest first
  const sortedGroupTabs = useMemo(
    () => groupTabs?.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)) || [],
    [groupTabs]
  )

  const updateLastOpenedGroupId = (groupId: string) => {
    myAxios.put(urls.api.lastOpenedGroupId, { groupId })
  }

  const setFilter = useGroupFilterStore((s) => s.setFilter)

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
        const filterStore: IGroupFilterStore = JSON.parse(cookieStr)
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

  return (
    <>
      <Head>
        <title>Ideameter</title>
        <meta
          property="og:title"
          content={props.linkPreview?.title || "Ideameter"}
        />
        <meta
          property="og:description"
          content={
            props.linkPreview?.description ||
            "Quickly align ideas within your team"
          }
        />
      </Head>
      <HomeLayout>
        <Container>
          {groupId && selectedGroup && (
            <Box sx={{ mt: 1 }}>
              <FlexVCenter justifyContent="space-between">
                <Typography variant="h5">{selectedGroup.name}</Typography>
                <Button onClick={() => openGroupInsightsDialog(selectedGroup)}>
                  Insights
                </Button>
              </FlexVCenter>

              <Paper sx={{ mt: 2, width: "100%", background: "#2B2B2B" }}>
                <FlexVCenter
                  sx={{ px: 1, pt: 1, pb: 2, justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Tooltip title="Add tab">
                      <IconButton
                        onClick={() => openDialog(newTabDto({ groupId }))}
                      >
                        <MdAdd />
                      </IconButton>
                    </Tooltip>
                    <GroupTabs groupId={groupId} tabs={sortedGroupTabs} />
                  </div>

                  <GroupMoreIcon
                    group={selectedGroup}
                    onAfterDelete={() => {}}
                    canEdit
                  />
                </FlexVCenter>

                <SearchRow />
                {tabId && groupId && (
                  <GroupTabContent tabId={tabId} groupId={groupId} />
                )}
              </Paper>
            </Box>
          )}
        </Container>
      </HomeLayout>
    </>
  )
}

export default GroupId
