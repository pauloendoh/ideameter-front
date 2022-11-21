import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexHCenter from "@/components/_common/flexboxes/FlexHCenter"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useSaveGroupMutation from "@/hooks/react-query/domain/group/useSaveGroupMutation"
import useConfirmTabClose from "@/hooks/utils/useConfirmTabClose"
import useConfirmDialogStore from "@/hooks/zustand/dialogs/useConfirmDialogStore"
import useGroupDialogStore from "@/hooks/zustand/dialogs/useGroupDialogStore"
import GroupDto from "@/types/domain/group/GroupDto"
import urls from "@/utils/urls"
import { Box, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef } from "react"
import { Controller, useForm } from "react-hook-form"
import EditGroupPicture from "./EditGroupPicture/EditGroupPicture"
import GroupMembers from "./GroupMembers/GroupMembers"
import GroupMoreIcon from "./GroupMoreIcon/GroupMoreIcon"

const GroupDialog = () => {
  const router = useRouter()
  const { initialValue, isOpen, close } = useGroupDialogStore()
  const inputRef = useRef<HTMLDivElement>(null)
  const { mutate } = useSaveGroupMutation()

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<GroupDto>({
    defaultValues: initialValue,
  })

  const onSubmit = (values: GroupDto) => {
    mutate(values, {
      onSuccess: (savedGroup) => {
        close()
        router.push(urls.pages.groupId(String(savedGroup.id)))
      },
    })
  }

  useEffect(() => {
    if (isOpen) {
      reset(initialValue)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const saveIsDisabled = useMemo(() => {
    if (isDirty) return false
    return true
  }, [isDirty])

  useConfirmTabClose(isDirty && isOpen)

  const openConfirmDialog = useConfirmDialogStore((s) => s.openConfirmDialog)
  const confirmClose = () => {
    if (isDirty) {
      openConfirmDialog({
        onConfirm: () => close(),
        title: "Discard changes?",
      })
      return
    }
    close()
  }

  return (
    <Dialog
      onClose={confirmClose}
      open={isOpen}
      fullWidth
      maxWidth="xs"
      aria-labelledby="group-dialog"
    >
      <Box pb={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="group-dialog-title">
            <FlexVCenter justifyContent="space-between">
              <Typography variant="h5">
                {watch("id") ? "Edit Group" : "New Group"}
              </Typography>

              <GroupMoreIcon group={watch()} onAfterDelete={close} showDelete />
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <FlexCol pt={1} sx={{ gap: 2 }}>
              <FlexHCenter>
                <EditGroupPicture
                  groupName={watch("name")}
                  imageUrl={watch("imageUrl")}
                  onChangeImageUrl={(value) => setValue("imageUrl", value)}
                />
              </FlexHCenter>

              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <MyTextField
                    size="small"
                    label="Group name"
                    fullWidth
                    required
                    {...field}
                    inputRef={inputRef}
                  />
                )}
              />

              <MyTextField
                id="description"
                size="small"
                label="Description"
                fullWidth
                {...register("description")}
              />
            </FlexCol>
          </DialogContent>

          <DialogTitle>
            <SaveCancelButtons disabled={saveIsDisabled} onCancel={confirmClose} />
          </DialogTitle>
        </form>

        {initialValue.id && <GroupMembers groupId={initialValue.id} />}
      </Box>
    </Dialog>
  )
}

export default GroupDialog
