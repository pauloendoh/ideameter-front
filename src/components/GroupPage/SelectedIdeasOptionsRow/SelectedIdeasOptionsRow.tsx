import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useMoveIdeasToTabDialogStore from "@/hooks/zustand/dialogs/useMoveIdeasToTabDialogStore"
import { Button, IconButton, Typography, useTheme } from "@mui/material"
import { BsArrowRightCircle } from "react-icons/bs"
import { MdOutlineClose } from "react-icons/md"
import useMultiSelectIdeas from "../GroupTabContent/IdeaRatingsTable/useMultiSelectIdeas/useMultiSelectIdeas"

interface Props {
  selectedIdeaIds: string[]
}

const SelectedIdeasOptionsRow = (props: Props) => {
  const { clearSelectedIds } = useMultiSelectIdeas()
  const theme = useTheme()

  const openMoveIdeasToTabDialog = useMoveIdeasToTabDialogStore(
    (s) => s.openDialog
  )

  return (
    <FlexVCenter
      justifyContent="space-between"
      px={2}
      py={0.5}
      sx={{ background: theme.palette.grey[900] }}
    >
      <Typography>{props.selectedIdeaIds.length} selected</Typography>

      <FlexVCenter>
        <Button
          startIcon={<BsArrowRightCircle />}
          color="secondary"
          onClick={() => openMoveIdeasToTabDialog(props.selectedIdeaIds)}
        >
          Move to tab
        </Button>
        <IconButton onClick={clearSelectedIds}>
          <MdOutlineClose />
        </IconButton>
      </FlexVCenter>
    </FlexVCenter>
  )
}

export default SelectedIdeasOptionsRow
