import GroupTabContent from "@/components/GroupPage/GroupTabContent/GroupTabContent";
import GroupTabs from "@/components/GroupPage/GroupTabs/GroupTabs";
import SearchRow from "@/components/GroupPage/SearchRow/SearchRow";
import GroupMoreIcon from "@/components/layout/dialogs/GroupDialog/GroupMoreIcon/GroupMoreIcon";
import HomeLayout from "@/components/layout/HomeLayout/HomeLayout";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import useGroupTabsQuery from "@/hooks/react-query/domain/group/tab/useGroupTabsQuery";
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery";
import useTabDialogStore from "@/hooks/zustand/dialogs/useTabDialogStore";
import { resetGroupFilterStore } from "@/hooks/zustand/domain/auth/group/useGroupFilterStore";
import { newTabDto } from "@/types/domain/group/tab/TabDto";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { MdAdd } from "react-icons/md";

const GroupId: NextPage = () => {
  const { data: groups } = useGroupsQuery();
  const { openDialog } = useTabDialogStore();

  const query = useRouter().query as { groupId: string; tabId?: string };

  const selectedGroup = useMemo(() => {
    if (!groups) return undefined;
    return groups.find((group) => group.id === query.groupId);
  }, [groups, query.groupId]);

  const { data: groupTabs } = useGroupTabsQuery(query.groupId);

  // oldest first
  const sortedGroupTabs = useMemo(
    () => groupTabs?.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)) || [],
    [groupTabs]
  );

  useEffect(() => {
    resetGroupFilterStore();
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

                  <GroupTabs groupId={query.groupId} tabs={sortedGroupTabs} />
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
