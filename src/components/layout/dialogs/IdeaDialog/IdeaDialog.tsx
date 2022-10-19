import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupIdeasQuery from "@/hooks/react-query/domain/group/idea/useGroupIdeasQuery"
import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import useConfirmTabClose from "@/hooks/utils/useConfirmTabClose"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useConfirmDialogStore from "@/hooks/zustand/dialogs/useConfirmDialogStore"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import urls from "@/utils/urls"
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { MdClose } from "react-icons/md"
import IdeaDialogLeftCol from "./IdeaDialogLeftCol/IdeaDialogLeftCol"
import IdeaDialogRatingsAccordion from "./IdeaDialogLeftCol/IdeaDialogRatingsAccordion/IdeaDialogRatingsAccordion"
import IdeaDialogRightCol from "./IdeaDialogRightCol/IdeaDialogRightCol"
import IdeaDialogSubideasAccordion from "./IdeaDialogSubideasAccordion/IdeaDialogSubideasAccordion"
import IdeaMenu from "./IdeaMenu/IdeaMenu"

const ariaLabel = "idea-dialog"

const IdeaDialog = () => {
  const inputRef = useRef<HTMLDivElement>(null)

  // I had to add this validator because sometimes the dialog was reopening after closing
  const [canOpen, setCanOpen] = useState(true)

  const { mutate: submitSaveIdea, isLoading: isSubmitting } = useSaveIdeaMutation()

  const { openDialog, initialValue, dialogIsOpen, closeDialog } = useIdeaDialogStore()

  const { watch, control, setValue, handleSubmit, reset, formState } = useForm<IdeaDto>({
    defaultValues: initialValue,
  })

  type SetValueParams = Parameters<typeof setValue>
  const setValueDirty = (...p: SetValueParams) => {
    return setValue(p[0], p[1], p[2] || { shouldDirty: true })
  }

  const routerQuery = useRouterQueryString()
  const router = useRouter()

  useEffect(() => {
    if (dialogIsOpen) {
      reset(initialValue)

      // makes sure that the URL will change when you open an idea
      if (initialValue.id && routerQuery.groupId && routerQuery.tabId) {
        router.push(
          urls.pages.groupTabIdea(
            routerQuery.groupId,
            routerQuery.tabId,
            initialValue.id
          ),
          undefined,
          { shallow: true }
        )
      }

      setTimeout(() => {
        inputRef.current?.focus()
      }, 250)
    }

    if (!dialogIsOpen && initialValue.id) {
      setCanOpen(false)
      setTimeout(() => {
        if (routerQuery.groupId && routerQuery.tabId) {
          router.push(
            urls.pages.groupTab(routerQuery.groupId, routerQuery.tabId),
            undefined,
            { shallow: true }
          )
        }
        setCanOpen(true)
      }, 250) // I had to add this delay because it was having some weird behavior where the dialog seemed to stay open even when it was not visible
    }
  }, [dialogIsOpen])

  const { data: groupIdeas } = useGroupIdeasQuery(routerQuery.groupId!)

  useEffect(() => {
    if (groupIdeas && routerQuery.ideaId) {
      const foundIdea = groupIdeas.find((i) => i.id === routerQuery.ideaId)
      if (foundIdea && !dialogIsOpen && canOpen) {
        openDialog(foundIdea)
      }
    }
  }, [groupIdeas, routerQuery.ideaId]) // don't add dialogIsOpen or dontReopen, otherwise it will keep opening while closing the dialog

  const onSubmit = (values: IdeaDto) => {
    submitSaveIdea(values, {
      onSuccess: closeDialog,
    })
  }

  useConfirmTabClose(formState.isDirty && dialogIsOpen)
  const openConfirmDialog = useConfirmDialogStore((s) => s.openConfirmDialog)

  const confirmClose = () => {
    if (formState.isDirty) {
      openConfirmDialog({
        onConfirm: () => closeDialog(),
        title: "Discard changes?",
      })
    } else {
      closeDialog()
    }
  }

  const saveButtonIsDisabled = useMemo(() => isSubmitting || !formState.isDirty, [
    isSubmitting,
    formState.isDirty,
  ])

  return (
    <Dialog
      onKeyDown={(e) => {
        if (e.key === "Esc") {
          e.preventDefault()
          e.stopPropagation()
          confirmClose()
        }
      }}
      open={dialogIsOpen}
      onClose={confirmClose}
      fullWidth
      maxWidth="xl"
      aria-labelledby={ariaLabel}
    >
      <Box pb={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id={`${ariaLabel}-title`}>
            <FlexVCenter justifyContent="space-between">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <MyTextField
                    size="small"
                    fullWidth
                    multiline
                    placeholder="Idea Title"
                    variant="standard"
                    onCtrlEnter={() => onSubmit(watch())}
                    required
                    sx={{
                      background: "transparent",
                    }}
                    InputProps={{
                      sx: {
                        fontSize: 18,
                      },
                    }}
                    {...field}
                    onBlur={() => {}} // overwrite the field.onBlur so it doesn't dirty the form unnecessarily
                    inputRef={inputRef}
                  />
                )}
              />

              <FlexVCenter>
                <IdeaMenu idea={watch()} afterDelete={closeDialog} />
                <IconButton onClick={confirmClose}>
                  <MdClose />
                </IconButton>
              </FlexVCenter>
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <Grid container pt={1} spacing={2}>
              <IdeaDialogLeftCol
                watch={watch}
                setValue={setValueDirty}
                control={control}
                onSubmit={onSubmit}
              />

              <IdeaDialogRightCol watch={watch} setValue={setValueDirty} />
            </Grid>

            {initialValue.id && watch("tabId") && routerQuery.groupId && (
              <Box mt={4}>
                <IdeaDialogRatingsAccordion
                  groupId={routerQuery.groupId}
                  tabId={String(watch("tabId"))}
                  ideaId={initialValue.id} // if you use watch("id"), sometimes it would keep the last opened dialog idea id
                />
              </Box>
            )}

            {initialValue.id && (
              <Box mt={4}>
                <IdeaDialogSubideasAccordion ideaId={initialValue.id} />
              </Box>
            )}
          </DialogContent>

          <DialogTitle>
            <SaveCancelButtons disabled={saveButtonIsDisabled} onCancel={confirmClose} />
          </DialogTitle>
        </form>
      </Box>
    </Dialog>
  )
}

export default IdeaDialog
