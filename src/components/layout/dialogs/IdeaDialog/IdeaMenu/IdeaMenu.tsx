import useDeleteIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useDeleteIdeaMutation"
import useConfirmDialogStore from "@/hooks/zustand/dialogs/useConfirmDialogStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { IconButton, Menu, MenuItem, useTheme } from "@mui/material"
import React from "react"
import { MdMoreHoriz } from "react-icons/md"

interface Props {
  idea: IdeaDto
  afterDelete?: () => void
}

const ariaName = `idea-menu`

const IdeaMenu = (props: Props) => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const openConfirmDialog = useConfirmDialogStore((s) => s.openConfirmDialog)
  const { mutate: submitDeleteIdea } = useDeleteIdeaMutation()

  const setSuccessMessage = useSnackbarStore((s) => s.setSuccessMessage)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    openConfirmDialog({
      title: "Delete idea?",
      onConfirm: () => {
        submitDeleteIdea(
          { idea: props.idea },
          {
            onSuccess: () => {
              handleClose()
              if (props.afterDelete) props.afterDelete()
            },
          }
        )
      },
    })
  }

  const handleCopyId = () => {
    if (navigator) {
      navigator.clipboard.writeText(props.idea.id)
      setSuccessMessage(`Copied: ${props.idea.id}`)
    }
  }

  return (
    <div>
      <IconButton
        id={`${ariaName}-button`}
        aria-controls={open ? ariaName : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MdMoreHoriz />
      </IconButton>

      <Menu
        id={ariaName}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": `${ariaName}-button`,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleCopyId}>Copy idea ID</MenuItem>

        <MenuItem onClick={handleDelete} style={{ color: theme.palette.error.main }}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  )
}

export default IdeaMenu
