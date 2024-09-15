import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import Flex from "@/components/_common/flexboxes/Flex"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupIdeasQuery from "@/hooks/react-query/domain/group/idea/useGroupIdeasQuery"
import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import useConfirmTabClose from "@/hooks/utils/useConfirmTabClose"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useConfirmDialogStore from "@/hooks/zustand/dialogs/useConfirmDialogStore"
import useEditLabelDialogStore from "@/hooks/zustand/dialogs/useEditLabelDialogStore"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import useSubideaDialogStore from "@/hooks/zustand/dialogs/useSubideaDialogStore"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import urls from "@/utils/urls"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { MdArchive, MdClose, MdSave } from "react-icons/md"
import DiscussionAccordion from "./DiscussionAccordion/DiscussionAccordion"
import IdeaDialogLeftCol from "./IdeaDialogLeftCol/IdeaDialogLeftCol"
import IdeaDialogRatingsAccordion from "./IdeaDialogLeftCol/IdeaDialogRatingsAccordion/IdeaDialogRatingsAccordion"
import IdeaDialogRightCol from "./IdeaDialogRightCol/IdeaDialogRightCol"
import IdeaDialogSubideasAccordion from "./IdeaDialogSubideasAccordion/IdeaDialogSubideasAccordion"
import IdeaMenu from "./IdeaMenu/IdeaMenu"
import { useAssignMeFromDialogHotkey } from "./useAssignMeFromDialogHotkey/useAssignMeFromDialogHotkey"
import { useSaveIdeaWithoutClosingHotkey } from "./useSaveIdeaWithoutClosingHotkey/useSaveIdeaWithoutClosingHotkey"
import { useToggleVoteFromDialog } from "./useToggleVoteFromDialog/useToggleVoteFromDialog"

const ariaLabel = "idea-dialog"

const IdeaDialog = () => {
  const inputRef = useRef<HTMLDivElement>(null)

  // I had to add this validator because sometimes the dialog was reopening after closing
  const [canOpen, setCanOpen] = useState(true)

  const { mutate: submitSaveIdea, isLoading: isSubmitting } =
    useSaveIdeaMutation()

  const { openDialog, initialValue, dialogIsOpen, closeDialog } =
    useIdeaDialogStore()

  const { watch, control, setValue, handleSubmit, reset, formState } =
    useForm<IdeaDto>({
      defaultValues: initialValue,
    })

  type SetValueParams = Parameters<typeof setValue>
  const setValueDirty = (...p: SetValueParams) => {
    return setValue(p[0], p[1], p[2] || { shouldDirty: true })
  }

  const routerQuery = useRouterQueryString()
  const router = useRouter()

  useEffect(() => {
    if (dialogIsOpen) reset(initialValue)
  }, [initialValue, dialogIsOpen])

  useEffect(() => {
    if (dialogIsOpen) {
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
          console.log("IdeaDialog.tsx")
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
    if (groupIdeas && routerQuery.ideaId && router.isReady) {
      const foundIdea = groupIdeas.find((i) => i.id === routerQuery.ideaId)
      if (foundIdea && !dialogIsOpen && canOpen) {
        openDialog(foundIdea)
      }
    }
  }, [groupIdeas, router.isReady, routerQuery.ideaId]) // don't add dialogIsOpen or dontReopen, otherwise it will keep opening while closing the dialog

  const onSubmit = (values: IdeaDto) => {
    submitSaveIdea(values, {
      onSuccess: closeDialog,
    })
  }

  useConfirmTabClose(formState.isDirty && dialogIsOpen)
  const openConfirmDialog = useConfirmDialogStore((s) => s.openConfirmDialog)

  const confirmClose = useCallback(() => {
    // isDirty was not working properly working properly for this case -> https://ideameter.app/group/cl96et2dn29290mxeivi350a3?tabId=cl973yolu31050mwfbmjwx7eh&ideaId=clbye9egt29790mvxnjrs2ha4
    const dirtyFieldKeys = Object.keys(formState.dirtyFields)
    if (dirtyFieldKeys.length > 0) {
      openConfirmDialog({
        onConfirm: () => closeDialog(),
        title: "Discard changes?",
      })
      return
    }
    closeDialog()
  }, [formState.dirtyFields, dialogIsOpen])

  const { dialogIsOpen: subideaDialogIsOpen } = useSubideaDialogStore()

  const { authUser } = useAuthStore()

  useAssignMeFromDialogHotkey({
    dialogIsOpen,
    authUser,
    currentAssignedUsers: watch("assignedUsers"),
    onChange: (newAssignedUsers) => {
      setValue("assignedUsers", newAssignedUsers, { shouldDirty: true })
    },
  })

  useToggleVoteFromDialog({
    dialogIsOpen,
    currentVotes: watch("highImpactVotes"),
    ideaId: watch("id"),
    userId: authUser!.id,
    onChange: (newVotes) =>
      setValueDirty("highImpactVotes", newVotes, { shouldDirty: true }),
  })

  const { dialogIsOpen: labelsDialogIsOpen } = useEditLabelDialogStore()

  const completedWithoutAssignedUsers = useMemo(() => {
    return watch("assignedUsers").length === 0 && watch("isDone")
  }, [watch("assignedUsers"), watch("isDone")])

  const saveIsDisabled = useMemo(() => {
    const dirtyFields = Object.keys(formState.dirtyFields)

    return (
      isSubmitting ||
      dirtyFields.length === 0 ||
      !formState.isDirty ||
      subideaDialogIsOpen ||
      labelsDialogIsOpen ||
      completedWithoutAssignedUsers
    )
  }, [
    isSubmitting,
    watch(),
    labelsDialogIsOpen,
    subideaDialogIsOpen,
    formState,
  ])

  const saveWithoutClosing = useCallback(() => {
    if (saveIsDisabled) return
    submitSaveIdea(watch(), {
      onSuccess: (idea) => {
        reset(idea)
      },
    })
  }, [saveIsDisabled, watch])

  useSaveIdeaWithoutClosingHotkey({
    dialogIsOpen,
    saveWithoutClosing,
    ideaDto: watch(),
  })

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
      {watch("isArchived") && (
        <FlexVCenter
          sx={{
            gap: 0.5,
            p: 2,

            background: (theme) => theme.palette.grey[700],
          }}
        >
          <MdArchive fontSize={24} />
          <Typography fontSize={24}>This idea is archived</Typography>
        </FlexVCenter>
      )}
      <Box pb={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id={`${ariaLabel}-title`}>
            <Flex justifyContent="space-between" gap={2}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <MyTextField
                    size="small"
                    fullWidth
                    placeholder="Idea Title"
                    variant="standard"
                    multiline
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

              <Flex gap={1}>
                <div>
                  <SaveCancelButtons
                    isLoadingAndDisabled={isSubmitting}
                    disabled={saveIsDisabled}
                    onCancel={confirmClose}
                    onEnabledAndCtrlEnter={() => onSubmit(watch())}
                    hideCancel
                    saveText="Save and close"
                    saveWidth={150}
                    saveIcon={<MdSave />}
                  />
                </div>

                {watch("id") && (
                  <IdeaMenu idea={watch()} afterDelete={closeDialog} />
                )}

                <div>
                  <IconButton onClick={confirmClose}>
                    <MdClose />
                  </IconButton>
                </div>
              </Flex>
            </Flex>
          </DialogTitle>

          <DialogContent
            sx={{
              maxHeight: "calc(100vh - 256px)",
            }}
          >
            <Grid container pt={1} spacing={2}>
              <IdeaDialogLeftCol
                watch={watch}
                setValue={setValueDirty}
                control={control}
                onSubmit={onSubmit}
                onSaveWithoutClosing={saveWithoutClosing}
              />

              <IdeaDialogRightCol watch={watch} setValue={setValueDirty} />
            </Grid>

            {watch("id") && watch("tabId") && routerQuery.groupId && (
              <Box mt={4}>
                <IdeaDialogRatingsAccordion
                  groupId={routerQuery.groupId}
                  tabId={String(watch("tabId"))}
                  ideaId={watch("id")}
                  initialRatingsAreEnabled={
                    formState.defaultValues?.ratingsAreEnabled ?? true
                  }
                  ratingsAreEnabled={watch("ratingsAreEnabled")}
                  onChangeRatingsAreEnabled={(value) =>
                    setValueDirty("ratingsAreEnabled", value)
                  }
                />
              </Box>
            )}

            {watch("id") && (
              <Box mt={4}>
                <IdeaDialogSubideasAccordion ideaId={watch("id")} />
              </Box>
            )}

            {watch("id") && (
              <Box mt={4}>
                <DiscussionAccordion ideaId={watch("id")} />
              </Box>
            )}
          </DialogContent>
        </form>
      </Box>
    </Dialog>
  )
}

export default IdeaDialog
