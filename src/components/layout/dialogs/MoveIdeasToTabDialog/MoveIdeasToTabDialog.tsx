import useMultiSelectIdeas from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/useMultiSelectIdeas/useMultiSelectIdeas"
import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useGroupTabsQuery from "@/hooks/react-query/domain/group/tab/useGroupTabsQuery"
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery"
import useMoveIdeasToTabMutation from "@/hooks/react-query/domain/idea/useMoveIdeasToTabMutation"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useMoveIdeasToTabDialogStore from "@/hooks/zustand/dialogs/useMoveIdeasToTabDialogStore"
import { MoveIdeasToTabDto } from "@/types/domain/idea/MoveIdeasToTabDto"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { MdClose } from "react-icons/md"

const ariaLabel = "move-ideas-to-tab-dialog"

const MoveIdeasToTabDialog = () => {
  const { mutate: submitMove } = useMoveIdeasToTabMutation()
  const { initialValue, dialogIsOpen, closeDialog } =
    useMoveIdeasToTabDialogStore()

  const { clearSelectedIds } = useMultiSelectIdeas()

  const { watch, handleSubmit, reset, setValue } = useForm<MoveIdeasToTabDto>({
    defaultValues: initialValue,
  })

  const { groupId } = useRouterQueryString()

  const { data: groups } = useGroupsQuery()

  const [selectedGroupId, setSelectedGroupId] = useState(groupId)

  const { data: tabs } = useGroupTabsQuery(selectedGroupId)

  useEffect(() => {
    if (dialogIsOpen) {
      reset(initialValue)
    }
  }, [dialogIsOpen])

  const onSubmit = (dto: MoveIdeasToTabDto) => {
    submitMove(dto, {
      onSuccess: () => {
        closeDialog()
        clearSelectedIds()
      },
    })
  }

  const saveIsDisabled = useMemo(() => watch("tabId") === "", [watch("tabId")])

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
              <Typography variant="h5">
                Move {watch("ideaIds").length} ideas to tab
              </Typography>

              <IconButton onClick={closeDialog}>
                <MdClose />
              </IconButton>
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <FormControl sx={{ mt: 1 }} fullWidth size="small">
              <InputLabel id={"group-selector-label"}>Group</InputLabel>
              <Select
                labelId={"group-selector-label"}
                id={"group-selector-select"}
                label="Tab"
                size="small"
                value={selectedGroupId}
                onChange={(e) => {
                  setSelectedGroupId(e.target.value as string)
                }}
              >
                {groups?.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ mt: 1 }} fullWidth size="small">
              <InputLabel id={ariaLabel + "-label"}>Tab</InputLabel>
              <Select
                labelId={ariaLabel + "-label"}
                id={ariaLabel + "-select"}
                label="Tab"
                size="small"
                value={watch("tabId")}
                onChange={(e) => {
                  setValue("tabId", e.target.value)
                }}
              >
                {tabs?.map((tab) => (
                  <MenuItem key={tab.id} value={tab.id}>
                    {tab.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>

          <DialogTitle>
            <SaveCancelButtons
              disabled={saveIsDisabled}
              onCancel={closeDialog}
            />
          </DialogTitle>
        </form>
      </Box>
    </Dialog>
  )
}

export default MoveIdeasToTabDialog
