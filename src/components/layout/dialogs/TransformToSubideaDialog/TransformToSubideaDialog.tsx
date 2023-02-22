import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useTransformToSubideaMutation from "@/hooks/react-query/domain/subidea/useTransformToSubideaMutation"
import useTransformToSubideadialogStore, {
  IInitialValue,
} from "@/hooks/zustand/dialogs/useTransformToSubideadialogStore"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { MdClose } from "react-icons/md"

const ariaLabel = "transform-to-subidea-dialog"

const TransformToSubideaDialog = () => {
  const router = useRouter()
  const inputRef = useRef<HTMLDivElement>(null)

  const { mutate, isLoading } = useTransformToSubideaMutation()
  const { initialValue, dialogIsOpen, closeDialog } =
    useTransformToSubideadialogStore()

  const { watch, control, handleSubmit, reset } = useForm({
    defaultValues: initialValue,
  })

  useEffect(() => {
    if (dialogIsOpen) {
      reset(initialValue)

      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [dialogIsOpen])

  const onSubmit = (values: IInitialValue) => {
    mutate(values, {
      onSuccess: (savedTab) => {
        closeDialog()
      },
    })
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id={`${ariaLabel}-title`}>
            <FlexVCenter justifyContent="space-between">
              <Typography variant="h5">Transform to Subidea</Typography>

              <IconButton onClick={closeDialog}>
                <MdClose />
              </IconButton>
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <Controller
              control={control}
              name="newParentIdeaTitle"
              render={({ field }) => (
                <MyTextField
                  id="name"
                  size="small"
                  label="New Parent Idea Title"
                  fullWidth
                  required
                  autoFocus
                  sx={{ mt: 1 }}
                  {...field}
                  inputRef={inputRef}
                />
              )}
            />
          </DialogContent>

          <DialogTitle>
            <SaveCancelButtons
              disabled={isLoading}
              onCancel={closeDialog}
              onEnabledAndCtrlEnter={handleSubmit(onSubmit)}
            />
          </DialogTitle>
        </form>
      </Box>
    </Dialog>
  )
}

export default TransformToSubideaDialog
