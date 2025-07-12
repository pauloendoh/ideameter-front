import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import LabelsSelector from "@/components/GroupPage/SearchRow/FilterButton/LabelsSelector/LabelsSelector"
import { useAddLabelsToIdeasMutation } from "@/hooks/react-query/domain/label/useAddLabelsToIdeasMutation"
import { useAddLabelsToIdeasDialogStore } from "@/hooks/zustand/dialogs/useAddLabelsToIdeasDialogStore"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { MdClose } from "react-icons/md"

const ariaLabel = "add-labels-to-ideas-dialog"

export const AddLabelsToIdeasDialog = () => {
  const [values, setValues] = useState<string[]>([])

  const { initialValue, dialogIsOpen, closeDialog } =
    useAddLabelsToIdeasDialogStore()

  const { isLoading, mutate: submitAddLabelsToMany } =
    useAddLabelsToIdeasMutation()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (dialogIsOpen) {
      setValues([])

      setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
    }
  }, [dialogIsOpen])

  const handleSubmit = () => {
    submitAddLabelsToMany(
      {
        ideaIds: initialValue.selectedIdeaIds,
        labelIds: values,
        groupId: initialValue.groupId,
      },
      {
        onSuccess: () => {
          closeDialog()
        },
      }
    )
  }

  return (
    <Dialog
      open={dialogIsOpen}
      onClose={closeDialog}
      fullWidth
      maxWidth="xs"
      aria-labelledby={ariaLabel}
    >
      <Box pb={1}>
        <DialogTitle id={`${ariaLabel}-title`}>
          <FlexVCenter justifyContent="space-between">
            <Typography variant="h5">Add labels</Typography>

            <IconButton onClick={closeDialog}>
              <MdClose />
            </IconButton>
          </FlexVCenter>
        </DialogTitle>

        <DialogContent>
          <FlexCol paddingTop={1}>
            <LabelsSelector
              selectedLabelIds={values}
              onChange={(ids) => {
                setValues(ids)
              }}
              inputRef={inputRef}
            />
          </FlexCol>
        </DialogContent>

        <DialogTitle>
          <SaveCancelButtons
            onSave={handleSubmit}
            disabled={isLoading}
            onCancel={closeDialog}
            onEnabledAndCtrlEnter={handleSubmit}
          />
        </DialogTitle>
      </Box>
    </Dialog>
  )
}
