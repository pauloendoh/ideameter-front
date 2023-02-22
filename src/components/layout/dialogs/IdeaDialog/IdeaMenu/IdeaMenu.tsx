import useDeleteIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useDeleteIdeaMutation"
import useConfirmDialogStore from "@/hooks/zustand/dialogs/useConfirmDialogStore"
import useTransformToSubideadialogStore from "@/hooks/zustand/dialogs/useTransformToSubideadialogStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { IconButton, Menu, MenuItem, useTheme } from "@mui/material"
import React, { useCallback } from "react"
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

  const handleCopyId = useCallback(() => {
    if (navigator) {
      navigator.clipboard.writeText(props.idea.id)
      setSuccessMessage(`Copied: ${props.idea.id}`)
    }
  }, [navigator, props.idea])

  const handleCopyTitleAndId = useCallback(() => {
    if (navigator) {
      const text = `${props.idea.name} [${props.idea.id}]`
      navigator.clipboard.writeText(text.replaceAll('"', "'"))
      setSuccessMessage(`Copied: ${text}`)
    }
  }, [navigator, props.idea])

  const { openDialog: openTransformToSubideaDialog } =
    useTransformToSubideadialogStore()

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
        <MenuItem onClick={handleCopyTitleAndId}>Copy title + ID</MenuItem>
        <MenuItem onClick={handleCopyId}>Copy idea ID</MenuItem>
        {/* <MenuItem
          onClick={() => {
            openTransformToSubideaDialog({
              ideaId: props.idea.id,
              newParentIdeaTitle: "",
            })
          }}
        >
          Transform to Subidea
        </MenuItem> */}

        <MenuItem
          onClick={handleDelete}
          style={{ color: theme.palette.error.main }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  )
}

export default IdeaMenu
