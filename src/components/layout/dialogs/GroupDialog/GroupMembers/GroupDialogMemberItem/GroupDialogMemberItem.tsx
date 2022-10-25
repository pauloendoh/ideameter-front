import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useDismissAdminMutation } from "@/hooks/react-query/domain/group-members/useDismissAdminMutation"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import { useMakeAdminMutation } from "@/hooks/react-query/domain/group-members/useMakeAdminMutation"
import { useRemoveGroupMemberMutation } from "@/hooks/react-query/domain/group-members/useRemoveGroupMemberMutation"
import useConfirmDialogStore from "@/hooks/zustand/dialogs/useConfirmDialogStore"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import UserGroupDto from "@/types/domain/group/UserGroupDto"
import {
  Button,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import { useMemo, useState } from "react"

interface Props {
  groupId: string
  userGroup: UserGroupDto
}

const GroupDialogMemberItem = (props: Props) => {
  const authUser = useAuthStore((s) => s.authUser)
  const { data: userGroups } = useGroupMembersQuery(props.groupId)

  const authUserIsAdmin = useMemo(() => {
    if (!authUser || !userGroups) return false

    const authGroupMember = userGroups.find(
      (userGroup) => userGroup.userId === authUser.id
    )

    return Boolean(authGroupMember?.isAdmin)
  }, [authUser, userGroups])

  const [isHovering, setIsHovering] = useState(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!authUserIsAdmin) return

    if (authUser?.id === props.userGroup.user?.id) return

    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const openConfirmDialog = useConfirmDialogStore((s) => s.openConfirmDialog)

  const { mutate: submitRemoveMember } = useRemoveGroupMemberMutation()
  const { mutate: submitMakeAdmin } = useMakeAdminMutation()
  const { mutate: submitDismissAdmin } = useDismissAdminMutation()

  return (
    <ListItem disablePadding>
      <ListItemButton disableGutters onClick={(e) => handleClick(e)}>
        <FlexVCenter flexGrow={1} sx={{ gap: 1.5 }}>
          <UserGroupAvatar
            userId={props.userGroup.userId}
            groupId={props.groupId}
            avatarProps={{
              sx: { width: 32, height: 32, fontSize: 20 },
            }}
          />
          <FlexVCenter justifyContent="space-between" flexGrow={1}>
            <FlexVCenter gap={2}>
              <Typography>
                {authUser && authUser.id === props.userGroup.user?.id
                  ? "You"
                  : props.userGroup.user?.username}
              </Typography>
            </FlexVCenter>

            {props.userGroup.isAdmin && (
              <Button variant="outlined" color="primary">
                Admin
              </Button>
            )}
          </FlexVCenter>
        </FlexVCenter>
      </ListItemButton>

      <Menu
        id="user-group-admin-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        BackdropProps={{
          onClick: (e) => {
            e.stopPropagation()
            handleClose()
          },
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {props.userGroup.isAdmin ? (
          <MenuItem
            onClick={(e) => {
              submitDismissAdmin({
                groupId: props.groupId,
                userId: props.userGroup.userId,
              })
              handleClose()
              e.stopPropagation()
            }}
          >
            <FlexVCenter gap={1}>
              <Typography>Dismiss admin</Typography>
            </FlexVCenter>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={(e) => {
              submitMakeAdmin({
                groupId: props.groupId,
                userId: props.userGroup.userId,
              })
              handleClose()
              e.stopPropagation()
            }}
          >
            <FlexVCenter gap={1}>
              <Typography>Turn into admin</Typography>
            </FlexVCenter>
          </MenuItem>
        )}

        <MenuItem
          onClick={(e) => {
            openConfirmDialog({
              title: "Remove user?",
              onConfirm: () => {
                submitRemoveMember({
                  groupId: props.groupId,
                  userId: props.userGroup.userId,
                })

                handleClose()
                e.stopPropagation()
              },
            })
          }}
        >
          <FlexVCenter gap={1}>
            <Typography color="red">Remove {props.userGroup.user?.username}</Typography>
          </FlexVCenter>
        </MenuItem>
      </Menu>
    </ListItem>
  )
}

export default GroupDialogMemberItem
