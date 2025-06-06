import { PiFireSimple } from "react-icons/pi"

import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import ProfilePicture from "@/components/_common/ProfilePicture/ProfilePicture"
import { useLogoutAndPushIndex } from "@/hooks/domain/auth/useLogoutAndPushIndex"
import useEditProfileDialogStore from "@/hooks/zustand/dialogs/useEditProfileDialogStore"
import useShortcutsDialogStore from "@/hooks/zustand/dialogs/useShortcutsDialogStore"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import {
  Divider,
  IconButton,
  Link as MUILink,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import Link from "next/link"
import { forwardRef, useState } from "react"
import {
  MdEdit,
  MdExitToApp,
  MdOfflineBolt,
  MdOutlineAssignmentInd,
  MdOutlineKeyboard,
} from "react-icons/md"

const NavbarUserMenu = () => {
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

  type HrefOption = { href?: string }

  const AssignedIdeaItem = forwardRef<any, HrefOption>((props, ref) => (
    <MenuItem>
      <MUILink {...props} ref={ref} underline="none" color="inherit">
        <FlexVCenter gap={1}>
          <MdOutlineAssignmentInd />
          <Typography>Assigned to me</Typography>
        </FlexVCenter>
      </MUILink>
    </MenuItem>
  ))

  return (
    <div>
      <IconButton onClick={(e) => handleClick(e)}>
        <ProfilePicture
          pictureUrl={authUser?.profile?.pictureUrl ?? ""}
          username={authUser?.username ?? ""}
          size={24}
        />
      </IconButton>
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
        {/* 
        <MenuItem
          onClick={() => {
            handleClose()

            router.push("/assigned-to-me")
          }}
        >
          <FlexVCenter gap={1}>
            <MdOutlineAssignmentInd />
            <Typography>Assigned to me</Typography>
          </FlexVCenter>
        </MenuItem> */}

        <Link href="/assigned-to-me" passHref>
          <AssignedIdeaItem />
        </Link>

        <Link href="/high-impact-voted">
          <a
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <MenuItem>
              <FlexVCenter gap={1}>
                <MdOfflineBolt />
                <Typography>Quick return voted</Typography>
              </FlexVCenter>
            </MenuItem>
          </a>
        </Link>

        <Link href="/highly-rated-ideas">
          <a
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <MenuItem>
              <FlexVCenter gap={1}>
                <PiFireSimple />
                <Typography>Highly rated ideas</Typography>
              </FlexVCenter>
            </MenuItem>
          </a>
        </Link>
        {/* <Link href="/my-ratings">
          <a
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <MenuItem>
              <FlexVCenter gap={1}>
                <MdStar />
                <Typography>My ratings</Typography>
              </FlexVCenter>
            </MenuItem>
          </a>
        </Link> */}

        {/* <Link href={urls.pages.ideaHighlights} passHref>
          <MenuItem>
            <FlexVCenter gap={1}>
              <GiStarsStack />
              <Typography>Idea highlights</Typography>
            </FlexVCenter>
          </MenuItem>
        </Link> */}

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
