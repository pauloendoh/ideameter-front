import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useSaveTabMutation from "@/hooks/react-query/domain/group/tab/useSaveTabMutation"
import useTabDialogStore from "@/hooks/zustand/dialogs/useTabDialogStore"
import TabDto from "@/types/domain/group/tab/TabDto"
import urls from "@/utils/urls"
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

const ariaLabel = "tab-dialog"

const TabDialog = () => {
  const router = useRouter()
  const inputRef = useRef<HTMLDivElement>(null)

  const { mutate, isLoading } = useSaveTabMutation()
  const { initialValue, dialogIsOpen, closeDialog } = useTabDialogStore()

  const { watch, control, handleSubmit, reset } = useForm<TabDto>({
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

  const onSubmit = (values: TabDto) => {
    mutate(values, {
      onSuccess: (savedTab) => {
        closeDialog()
        router.push(urls.pages.groupTab(savedTab.groupId, savedTab.id))
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
              <Typography variant="h5">{watch("id") ? "Edit Tab" : "New Tab"}</Typography>

              <IconButton onClick={closeDialog}>
                <MdClose />
              </IconButton>
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <MyTextField
                  id="name"
                  size="small"
                  label="Tab name"
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

export default TabDialog
