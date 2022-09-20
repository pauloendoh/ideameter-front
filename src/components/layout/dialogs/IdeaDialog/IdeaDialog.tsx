import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import useSubideaDialogStore from "@/hooks/zustand/dialogs/useSubideaDialogStore"
import IdeaDto, { newIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import urls from "@/utils/urls"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { MdClose } from "react-icons/md"
import IdeaDialogLeftCol from "./IdeaDialogLeftCol/IdeaDialogLeftCol"
import IdeaDialogRightCol from "./IdeaDialogRightCol/IdeaDialogRightCol"
import IdeaMenu from "./IdeaMenu/IdeaMenu"
import SubideasTable from "./SubideasTable/SubideasTable"

const ariaLabel = "idea-dialog"

const IdeaDialog = () => {
  const inputRef = useRef<HTMLDivElement>(null)

  const { mutate: submitSaveIdea } = useSaveIdeaMutation()

  const {
    initialValue,
    dialogIsOpen,
    closeDialog,
    setCanOpen,
  } = useIdeaDialogStore()

  const openSubideaDialog = useSubideaDialogStore((s) => s.openDialog)

  const { watch, control, setValue, handleSubmit, reset } = useForm<IdeaDto>({
    defaultValues: initialValue,
  })

  const routerQuery = useRouterQueryString()
  const router = useRouter()

  // I had to add this validator because sometimes the dialog was reopening after closing

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

  const handleClose = () => {
    closeDialog()
  }

  const onSubmit = (values: IdeaDto) => {
    submitSaveIdea(values, {
      onSuccess: () => {
        handleClose()
      },
    })
  }

  return (
    <Dialog
      open={dialogIsOpen}
      onClose={handleClose}
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
                    inputRef={inputRef}
                  />
                )}
              />

              <FlexVCenter>
                <IdeaMenu idea={watch()} afterDelete={handleClose} />
                <IconButton onClick={handleClose}>
                  <MdClose />
                </IconButton>
              </FlexVCenter>
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <Grid container pt={1} spacing={2}>
              <IdeaDialogLeftCol
                watch={watch}
                setValue={setValue}
                control={control}
                onSubmit={onSubmit}
              />

              <IdeaDialogRightCol watch={watch} setValue={setValue} />
            </Grid>

            {watch("id") && (
              <FlexCol mt={2}>
                <DarkButton
                  sx={{ width: 150 }}
                  onClick={() => {
                    openSubideaDialog(newIdeaDto({ parentId: watch("id") }))
                  }}
                >
                  Create subideas
                </DarkButton>

                <SubideasTable parentId={watch("id")} />
              </FlexCol>
            )}
          </DialogContent>

          <DialogTitle>
            <SaveCancelButtons
              // disabled={isSubmitting}
              onCancel={handleClose}
            />
          </DialogTitle>
        </form>
      </Box>
    </Dialog>
  )
}

export default IdeaDialog
