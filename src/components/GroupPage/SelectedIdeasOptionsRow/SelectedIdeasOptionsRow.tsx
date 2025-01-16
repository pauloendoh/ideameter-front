import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useCurrentGroup } from "@/hooks/domain/group/useCurrentGroup"
import { useAddLabelsToIdeasDialogStore } from "@/hooks/zustand/dialogs/useAddLabelsToIdeasDialogStore"
import useMoveIdeasToTabDialogStore from "@/hooks/zustand/dialogs/useMoveIdeasToTabDialogStore"
import { Button, IconButton, Typography, useTheme } from "@mui/material"
import { BsArrowRightCircle } from "react-icons/bs"
import { MdLabel, MdOutlineClose } from "react-icons/md"
import useMultiSelectIdeas from "../GroupTabContent/IdeaTable/useMultiSelectIdeas/useMultiSelectIdeas"

interface Props {
  selectedIdeaIds: string[]
  tabId: string
}

const SelectedIdeasOptionsRow = (props: Props) => {
  const { clearSelectedIds } = useMultiSelectIdeas()
  const theme = useTheme()

  const openMoveIdeasToTabDialog = useMoveIdeasToTabDialogStore(
    (s) => s.openDialog
  )

  const { openDialog: openAddLabelsDialog } = useAddLabelsToIdeasDialogStore()

  const currentGroup = useCurrentGroup()

  if (!currentGroup) {
    return null
  }

  return (
    <FlexVCenter
      justifyContent="space-between"
      px={2}
      py={0.5}
      sx={{ background: theme.palette.grey[900] }}
    >
      <Typography>{props.selectedIdeaIds.length} selected</Typography>

      <FlexVCenter gap={3}>
        <Button
          startIcon={<MdLabel />}
          color="secondary"
          onClick={() => {
            openAddLabelsDialog({
              selectedIdeaIds: props.selectedIdeaIds,
              groupId: currentGroup.id!,
            })
          }}
        >
          Add labels
        </Button>

        <Button
          startIcon={<BsArrowRightCircle />}
          color="secondary"
          onClick={() => openMoveIdeasToTabDialog(props.selectedIdeaIds)}
        >
          Move to tab
        </Button>
        <IconButton size="small" onClick={clearSelectedIds}>
          <MdOutlineClose />
        </IconButton>
      </FlexVCenter>
    </FlexVCenter>
  )
}

export default SelectedIdeasOptionsRow
