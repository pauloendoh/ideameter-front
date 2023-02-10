import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useSaveSubideaMutation from "@/hooks/react-query/domain/subidea/useSaveSubideaMutation"
import useSubideaDialogStore from "@/hooks/zustand/dialogs/useSubideaDialogStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
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
import SubideaMenu from "./SubideaMenu/SubideaMenu"

const ariaLabel = "subidea-dialog"

const SubideaDialog = () => {
  const inputRef = useRef<HTMLDivElement>(null)
  const query = useRouter().query as { groupId: string }

  const saveMutation = useSaveSubideaMutation()

  const { initialValue, dialogIsOpen, closeDialog } = useSubideaDialogStore()

  const { watch, control, setValue, handleSubmit, reset } = useForm<IdeaDto>({
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

  const onSubmit = (values: IdeaDto) => {
    saveMutation.mutate(
      { subidea: values, groupId: query.groupId },
      {
        onSuccess: (savedTab) => {
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
      aria-labelledby={ariaLabel}
      PaperProps={{
        sx: {
          maxWidth: 360,
        },
      }}
    >
      <Box pb={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id={`${ariaLabel}-title`}>
            <FlexVCenter justifyContent="space-between">
              <Typography variant="h5">
                {watch("id") ? "Edit Subidea" : "New Subidea"}
              </Typography>

              <FlexVCenter>
                {watch("id") && (
                  <SubideaMenu subidea={watch()} afterDelete={closeDialog} />
                )}
                <IconButton onClick={closeDialog}>
                  <MdClose />
                </IconButton>
              </FlexVCenter>
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <FlexCol pt={1} sx={{ gap: 2 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <MyTextField
                    size="small"
                    label="Subidea"
                    fullWidth
                    onCtrlEnter={() => onSubmit(watch())}
                    required
                    {...field}
                    inputRef={inputRef}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MyTextField
                    id="description"
                    size="small"
                    label="Description"
                    multiline
                    minRows={3}
                    onCtrlEnter={() => onSubmit(watch())}
                    {...field}
                    fullWidth
                  />
                )}
              />
            </FlexCol>
          </DialogContent>

          <DialogTitle>
            <SaveCancelButtons
              disabled={saveMutation.isLoading}
              onCancel={closeDialog}
            />
          </DialogTitle>
        </form>
      </Box>
    </Dialog>
  )
}

export default SubideaDialog
