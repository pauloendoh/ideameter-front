import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import MyTextField from "@/components/_common/inputs/MyTextField"
import Txt from "@/components/_common/text/Txt"
import useGroupIdeasQuery from "@/hooks/react-query/domain/group/idea/useGroupIdeasQuery"
import useConfirmDeleteGroupDialogStore from "@/hooks/zustand/dialogs/useConfirmDeleteGroupDialogStore"
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"

const ariaLabel = "confirm-delete-group-dialog"

const ConfirmDeleteGroupDialog = () => {
  const {
    closeDialog,
    dialogIsOpen,
    group,
    onConfirm,
  } = useConfirmDeleteGroupDialogStore()

  const { data: groupIdeas } = useGroupIdeasQuery(group.id!)

  const inputRef = useRef<HTMLDivElement>(null)

  const [text, setText] = useState("")
  useEffect(() => {
    if (dialogIsOpen) {
      setText("")
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [dialogIsOpen])

  const deleteIsAllowed = useMemo(() => text === group.name, [text, group])

  return (
    <Dialog
      onClose={closeDialog}
      open={dialogIsOpen}
      fullWidth
      maxWidth="xs"
      aria-labelledby={ariaLabel}
      PaperProps={{
        sx: {
          position: "absolute",
          top: 75,
        },
      }}
    >
      <Box pb={1} px={1}>
        <DialogTitle id="confirm-dialog-title" sx={{ pb: 0 }}>
          <Txt variant="h5">
            You are going to delete the group "{group.name}" and all its ideas (
            {groupIdeas?.length || 0})
          </Txt>
        </DialogTitle>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onConfirm()
            closeDialog()
          }}
        >
          <DialogContent sx={{ pt: 2 }}>
            <Txt>This action is irreversible</Txt>

            <MyTextField
              sx={{ mt: 3 }}
              fullWidth
              label="Type the name of the group to confirm"
              value={text}
              onChange={(e) => setText(e.currentTarget.value)}
              inputRef={inputRef}
            />
          </DialogContent>

          <DialogTitle>
            <SaveCancelButtons
              disabled={!deleteIsAllowed}
              onCancel={closeDialog}
            />
          </DialogTitle>
        </form>
      </Box>
    </Dialog>
  )
}

export default ConfirmDeleteGroupDialog
