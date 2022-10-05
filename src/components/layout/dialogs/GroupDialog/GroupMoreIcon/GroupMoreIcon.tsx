import useDeleteGroupMutation from "@/hooks/react-query/domain/group/useDeleteGroupMutation"
import useConfirmDeleteGroupDialogStore from "@/hooks/zustand/dialogs/useConfirmDeleteGroupDialogStore"
import useGroupDialogStore from "@/hooks/zustand/dialogs/useGroupDialogStore"
import useAutoScrollStore from "@/hooks/zustand/useAutoScrollStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import GroupDto from "@/types/domain/group/GroupDto"
import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { MdDelete, MdEdit, MdMoreHoriz, MdMouse } from "react-icons/md"

interface Props {
  group: GroupDto
  canEdit?: boolean
  onAfterDelete: () => void
  showDelete?: boolean
}

// PE 1/3 - rename to GroupMenu ?
function GroupMoreIcon(props: Props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleOpenMore = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMore = () => {
    setAnchorEl(null) // avoids error "The `anchorEl` prop provided to the component is invalid"
  }

  const deleteMutation = useDeleteGroupMutation()

  const { openDialog } = useGroupDialogStore()
  const {
    openDialog: openConfirmDeleteGroupDialog,
  } = useConfirmDeleteGroupDialogStore()

  const [autoScrollIsDisabled, toggleAutoScroll] = useAutoScrollStore((s) => [
    s.isDisabled,
    s.toggleIsDisabled,
  ])

  const setSuccessMessage = useSnackbarStore((s) => s.setSuccessMessage)

  return (
    <Box>
      <IconButton
        id="decision-more-icon"
        size="small"
        aria-label="decision-more-icon"
        onClick={(e) => {
          e.preventDefault()
          handleOpenMore(e)
        }}
      >
        <MdMoreHoriz />
      </IconButton>

      <Menu
        id="decision-more-menu"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={(e) => {
          // const event = e as any
          handleCloseMore()
        }}
      >
        {props.canEdit && (
          <MenuItem
            onClick={(e) => {
              handleCloseMore()
              openDialog(props.group)
            }}
          >
            <ListItemIcon sx={{ width: 16 }}>
              <MdEdit />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Edit group
            </Typography>{" "}
          </MenuItem>
        )}

        {props.canEdit && (
          <MenuItem
            onClick={(e) => {
              handleCloseMore()
              const message = autoScrollIsDisabled
                ? "Auto-scroll enabled!"
                : "Auto-scroll disabled!"
              setSuccessMessage(message)
              setTimeout(() => {
                toggleAutoScroll()
              }, 250) // so it changes the text after closing
            }}
          >
            <ListItemIcon sx={{ width: 16 }}>
              <MdMouse />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              {autoScrollIsDisabled
                ? "Enable auto-scroll for me"
                : "Disable auto-scroll for me"}
            </Typography>{" "}
          </MenuItem>
        )}
        {props.showDelete && (
          <MenuItem
            onClick={(e) => {
              openConfirmDeleteGroupDialog(props.group, () => {
                deleteMutation.mutate(String(props.group.id), {
                  onSuccess: props.onAfterDelete,
                })
              })
            }}
            id="delete-decision-button"
            sx={{ color: (theme) => theme.palette.error.main }}
          >
            <ListItemIcon
              sx={{ width: 16, color: (theme) => theme.palette.error.main }}
            >
              <MdDelete />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Delete group
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}

export default GroupMoreIcon
