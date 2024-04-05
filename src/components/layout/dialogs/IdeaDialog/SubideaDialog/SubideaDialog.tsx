import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import TimeagoSpan from "@/components/_common/text/TimeagoSpan"
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
import { useEffect, useMemo, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { MdClose } from "react-icons/md"
import IdeaDialogSelectedLabels from "../IdeaDialogSelectedLabels/IdeaDialogSelectedLabels"
import SubideaImageSection from "./SubideaImageSection/SubideaImageSection"
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

  const onSubmit = (values: IdeaDto, shouldClose = true) => {
    saveMutation.mutate(
      { subidea: values, groupId: query.groupId },
      {
        onSuccess: (savedSubidea) => {
          reset(savedSubidea)
          if (shouldClose) closeDialog()
        },
      }
    )
  }

  const isDisabled = useMemo(() => {
    return saveMutation.isLoading || !dialogIsOpen
  }, [saveMutation.isLoading, dialogIsOpen])

  return (
    <Dialog
      open={dialogIsOpen}
      onClose={closeDialog}
      fullWidth
      aria-labelledby={ariaLabel}
      maxWidth="sm"
    >
      <Box pb={1}>
        <form onSubmit={handleSubmit((val) => onSubmit(val))}>
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
                    multiline
                    required
                    {...field}
                    inputRef={inputRef}
                  />
                )}
              />

              <IdeaDialogSelectedLabels
                idea={watch()}
                onChangeSelectedLabels={(labels) => setValue("labels", labels)}
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
                    {...field}
                    fullWidth
                  />
                )}
              />

              <SubideaImageSection
                subidea={watch()}
                onChangeImageUrl={(imageUrl) =>
                  setValue("subideaImageUrl", imageUrl)
                }
              />
            </FlexCol>
          </DialogContent>

          <DialogTitle>
            <FlexVCenter justifyContent="space-between">
              <SaveCancelButtons
                disabled={isDisabled}
                onCancel={closeDialog}
                isLoadingAndDisabled={saveMutation.isLoading}
                onEnableAndCtrlS={() => onSubmit(watch(), false)}
                onEnabledAndCtrlEnter={() => onSubmit(watch(), true)}
              />

              <FlexVCenter gap={1}>
                {watch("creatorId") && (
                  <>
                    <UserGroupAvatar
                      groupId={query.groupId!}
                      userId={watch("creatorId")}
                      widthAndHeight={24}
                    />

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Typography>
                        Created <TimeagoSpan createdAt={watch("createdAt")} />
                      </Typography>
                    </div>
                  </>
                )}
              </FlexVCenter>
            </FlexVCenter>
          </DialogTitle>
        </form>
      </Box>
    </Dialog>
  )
}

export default SubideaDialog
