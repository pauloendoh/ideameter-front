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
import useTabDialogStore from "@/hooks/zustand/dialogs/useTabDialogStore"
import useGroupFilterStore, {
  resetGroupFilterStore,
} from "@/hooks/zustand/domain/auth/group/useGroupFilterStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { newTabDto } from "@/types/domain/group/tab/TabDto"
import myAxios from "@/utils/axios/myAxios"
import { cookieKeys } from "@/utils/cookieKeys"
import urls from "@/utils/urls"
import {
  Box,
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
  ideaName: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { ideaId } = context.query
  let ideaName = ""
  if (ideaId) {
    const res = await myAxios.get<string>(urls.api.ideaName(String(ideaId)))
    ideaName = res.data
  }
  return {
    props: {
      ideaName,
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
        const filterState = JSON.parse(cookieStr)
        if ("onlyCompletedIdeas" in filterState.filter) {
          useGroupFilterStore.setState(filterState)
          return
        }
      }
    }
    resetGroupFilterStore()
  }, [tabId])

  return (
    <>
      <Head>
        <title>{props.ideaName || "Ideameter"}</title>
        <meta
          property="og:title"
          content={props.ideaName || "Ideameter"}
          key="title"
        />
        <title>Social Media Preview</title>
        <meta property="og:url" content="your url" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="your fb app id" />

        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content="Hurray!! Yes Social Media Preview is Working"
        />
        <meta property="og:image" content={"/favicon.ico"} />
      </Head>
      <HomeLayout>
        <Container>
          {groupId && selectedGroup && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="h5">{selectedGroup.name}</Typography>
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
