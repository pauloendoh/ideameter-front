import FlexCol from "@/components/_common/flexboxes/FlexCol"
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery"
import useGroupDialogStore from "@/hooks/zustand/dialogs/useGroupDialogStore"
import { newGroupDto } from "@/types/domain/group/GroupDto"
import urls from "@/utils/urls"
import { Avatar, IconButton, Toolbar, Tooltip } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { MdAdd } from "react-icons/md"
import S from "./Sidebar.styles"

const Sidebar = () => {
  const { data: groups } = useGroupsQuery()
  const router = useRouter()
  const query = router.query as { groupId?: string }

  const { openDialog } = useGroupDialogStore()

  // newest first
  const sortedGroups = useMemo(() => {
    if (!groups) return []
    return groups.sort((a, b) =>
      (a.createdAt || "") > (b.createdAt || "") ? -1 : 1
    )
  }, [groups])

  const size = 40

  return (
    <S.Drawer
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
      <FlexCol sx={{ pt: 2, px: 2.5, gap: 1.5 }}>
        {sortedGroups.map((group) => (
          <Link key={group.id} href={urls.pages.groupId(String(group.id))}>
            <a style={{ position: "relative", textDecoration: "none" }}>
              <Tooltip title={group.name} placement="right">
                <div>
                  {query.groupId === group.id && <S.SelectedGroupLittleBar />}
                  {group.imageUrl ? (
                    <img
                      src={group.imageUrl}
                      width={size}
                      height={size}
                      style={{
                        borderRadius: 64,
                      }}
                    />
                  ) : (
                    <Avatar src={group.name} sx={{ width: size, height: size }}>
                      {group.name.substring(0, 2)}
                    </Avatar>
                  )}
                </div>
              </Tooltip>
            </a>
          </Link>
        ))}

        <Tooltip
          open={sortedGroups.length === 0 ? true : undefined}
          arrow
          title="Create group"
          placement="right"
        >
          <IconButton
            onClick={() => openDialog(newGroupDto())}
            sx={{
              background: "#3E3E3E",
              width: size,
              height: size,
              marginBottom: 5,
            }}
          >
            <MdAdd fontSize={20} />
          </IconButton>
        </Tooltip>
      </FlexCol>
    </S.Drawer>
  )
}

export default Sidebar
