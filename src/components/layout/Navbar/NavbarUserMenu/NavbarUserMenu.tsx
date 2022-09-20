import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useLogoutAndPushIndex } from "@/hooks/domain/auth/useLogout"
import useEditProfileDialogStore from "@/hooks/zustand/dialogs/useEditProfileDialogStore"
import useShortcutsDialogStore from "@/hooks/zustand/dialogs/useShortcutsDialogStore"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { Button, Divider, Menu, MenuItem, Typography } from "@mui/material"
import { useState } from "react"
import { MdEdit, MdExitToApp, MdOutlineKeyboard } from "react-icons/md"

interface Props {
  test?: string
}

const NavbarUserMenu = (props: Props) => {
  const authUser = useAuthStore((s) => s.authUser)

  const logout = useLogoutAndPushIndex()

  const openEditProfileDialog = useEditProfileDialogStore((s) => s.openDialog)

  const openShortcutsDialog = useShortcutsDialogStore((s) => s.openDialog)

  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget)
    event.preventDefault()
    event.stopPropagation()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button onClick={(e) => handleClick(e)}>{authUser?.username}</Button>
      <Menu
        id="navbar-user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={(e) => {
            handleClose()

            openEditProfileDialog(authUser!)
          }}
        >
          <FlexVCenter gap={1}>
            <MdEdit />
            <Typography>Edit profile</Typography>
          </FlexVCenter>
        </MenuItem>

        <Divider />
        <MenuItem
          onClick={(e) => {
            handleClose()

            openShortcutsDialog()
          }}
        >
          <FlexVCenter gap={1}>
            <MdOutlineKeyboard />
            <Typography>Keyboard shortcuts</Typography>
          </FlexVCenter>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={(e) => {
            handleClose()
            logout()
          }}
        >
          <FlexVCenter gap={1}>
            <MdExitToApp />
            <Typography>Logout</Typography>
          </FlexVCenter>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default NavbarUserMenu
