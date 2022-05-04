import FlexCol from "@/components/_common/flexboxes/FlexCol";
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery";
import useGroupDialogStore from "@/hooks/zustand/dialogs/useGroupDialogStore";
import { newGroupDto } from "@/types/domain/group/GroupDto";
import urls from "@/utils/urls";
import { Avatar, Drawer, IconButton, Toolbar, Tooltip } from "@mui/material";
import Link from "next/link";
import React, { useMemo } from "react";
import { MdAdd } from "react-icons/md";

const Sidebar = () => {
  const { data: groups } = useGroupsQuery();

  const { openDialog } = useGroupDialogStore();

  const sortedGroups = useMemo(() => {
    if (!groups) return [];
    return groups.sort(
      (
        a,
        b // newest first
      ) => ((a.createdAt || "") > (b.createdAt || "") ? -1 : 1)
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
        {groups?.map((group) => (
          <Tooltip key={group.id} title={group.name} placement="right">
            <Link href={urls.pages.groupdId(String(group.id))}>
              <a>
                <IconButton sx={{ width: 64, height: 64 }}>
                  <Avatar sx={{ width: 64, height: 64 }}>
                    {group.name.substring(0, 2)}
                  </Avatar>
                </IconButton>
              </a>
            </Link>
          </Tooltip>
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
