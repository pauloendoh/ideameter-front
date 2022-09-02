import FlexCol from "@/components/_common/flexboxes/FlexCol";
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery";
import useGroupDialogStore from "@/hooks/zustand/dialogs/useGroupDialogStore";
import { newGroupDto } from "@/types/domain/group/GroupDto";
import urls from "@/utils/urls";
import { Avatar, Drawer, IconButton, Toolbar, Tooltip } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { MdAdd } from "react-icons/md";
import S from "./Sidebar.styles";

const Sidebar = () => {
  const { data: groups } = useGroupsQuery();
  const router = useRouter();
  const query = router.query as { groupId?: string };

  const { openDialog } = useGroupDialogStore();

  // newest first
  const sortedGroups = useMemo(() => {
    if (!groups) return [];
    return groups.sort((a, b) =>
      (a.createdAt || "") > (b.createdAt || "") ? -1 : 1
    );
  }, [groups]);

  return (
    <Drawer
      variant="persistent"
      open
      anchor="left"
      sx={{
        flexShrink: 0,
        width: 105,
      }}
      PaperProps={{
        sx: {
          background: "#202020",
        },
      }}
    >
      <Toolbar />
      <FlexCol sx={{ pt: 2, px: 2.5, gap: 2 }}>
        {sortedGroups.map((group) => (
          <Link key={group.id} href={urls.pages.groupId(String(group.id))}>
            <Tooltip title={group.name} placement="right">
              <a style={{ position: "relative" }}>
                {query.groupId === group.id && <S.SelectedGroupLittleBar />}
                <IconButton sx={{ width: 64, height: 64 }}>
                  <Avatar sx={{ width: 64, height: 64 }}>
                    {group.name.substring(0, 2)}
                  </Avatar>
                </IconButton>
              </a>
            </Tooltip>
          </Link>
        ))}

        <Tooltip title="Create group" placement="right">
          <IconButton
            onClick={() => openDialog(newGroupDto())}
            sx={{ background: "#3E3E3E", width: 64, height: 64 }}
          >
            <MdAdd fontSize="24px" />
          </IconButton>
        </Tooltip>
      </FlexCol>
    </Drawer>
  );
};

export default Sidebar;
