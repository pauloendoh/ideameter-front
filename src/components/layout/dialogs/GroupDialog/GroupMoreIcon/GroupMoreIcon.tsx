import useDeleteGroupMutation from "@/hooks/react-query/domain/group/useDeleteGroupMutation"
import useConfirmDeleteGroupDialogStore from "@/hooks/zustand/dialogs/useConfirmDeleteGroupDialogStore"
import useGroupDialogStore from "@/hooks/zustand/dialogs/useGroupDialogStore"
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
import { MdDelete, MdEdit, MdMoreHoriz } from "react-icons/md"

interface Props {
  group: GroupDto
  canEdit?: boolean
  onAfterDelete: () => void
  showDelete?: boolean
}

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
