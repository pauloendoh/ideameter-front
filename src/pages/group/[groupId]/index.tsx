import GroupTabContent from "@/components/GroupPage/GroupTabContent/GroupTabContent";
import GroupTabs from "@/components/GroupPage/GroupTabs/GroupTabs";
import SearchRow from "@/components/GroupPage/SearchRow/SearchRow";
import GroupMoreIcon from "@/components/layout/dialogs/GroupDialog/GroupMoreIcon/GroupMoreIcon";
import HomeLayout from "@/components/layout/HomeLayout/HomeLayout";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import { useCheckAndRedirectLastOpenedGroup } from "@/hooks/domain/group/useCheckAndRedirectLastOpenedGroup";
import useGroupTabsQuery from "@/hooks/react-query/domain/group/tab/useGroupTabsQuery";
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery";
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import useTabDialogStore from "@/hooks/zustand/dialogs/useTabDialogStore";
import { resetGroupFilterStore } from "@/hooks/zustand/domain/auth/group/useGroupFilterStore";
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import { newTabDto } from "@/types/domain/group/tab/TabDto";
import myAxios from "@/utils/axios/myAxios";
import urls from "@/utils/urls";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { useEffect, useMemo } from "react";
import { MdAdd } from "react-icons/md";

const GroupId: NextPage = () => {
  const { data: groups } = useGroupsQuery();
  const { openDialog } = useTabDialogStore();

  const query = useRouterQueryString();

  const setErrorMessage = useSnackbarStore((s) => s.setErrorMessage);
  const checkAndRedirectLastOpenedGroup = useCheckAndRedirectLastOpenedGroup();

  const selectedGroup = useMemo(() => {
    if (!groups) return undefined;

    const foundGroup = groups.find((group) => group.id === query.groupId);
    if (!foundGroup) {
      setErrorMessage("Group not found. Redirecting to last opened group...");
      checkAndRedirectLastOpenedGroup();
      return undefined;
    }

    return foundGroup;
  }, [groups, query.groupId]);

  const { data: groupTabs } = useGroupTabsQuery(query.groupId!);

  // oldest first
  const sortedGroupTabs = useMemo(
    () => groupTabs?.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)) || [],
    [groupTabs]
  );

  const updateLastOpenedGroupId = (groupId: string) => {
    myAxios.put(urls.api.lastOpenedGroupId, { groupId });
  };

  useEffect(() => {
    resetGroupFilterStore();

    if (query.groupId) updateLastOpenedGroupId(query.groupId);
  }, [query.groupId]);

  return (
    <HomeLayout>
      <Container>
        {selectedGroup && (
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5">{selectedGroup.name}</Typography>
            <Paper sx={{ mt: 2, width: "100%", background: "#2B2B2B" }}>
              <FlexVCenter
                sx={{ px: 1, pt: 1, pb: 2, justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Add tab">
                    <IconButton
                      onClick={() =>
                        openDialog(newTabDto({ groupId: query.groupId }))
                      }
                    >
                      <MdAdd />
                    </IconButton>
                  </Tooltip>

                  <GroupTabs groupId={query.groupId!} tabs={sortedGroupTabs} />
                </div>

                <GroupMoreIcon
                  group={selectedGroup}
                  onAfterDelete={() => {}}
                  canEdit
                />
              </FlexVCenter>

              <SearchRow />
              {query.tabId && <GroupTabContent tabId={query.tabId} />}
            </Paper>
          </Box>
        )}
      </Container>
    </HomeLayout>
  );
};

export default GroupId;
