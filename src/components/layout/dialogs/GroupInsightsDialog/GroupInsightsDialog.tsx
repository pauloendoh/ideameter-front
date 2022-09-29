import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useGroupInsightsDialogStore from "@/hooks/zustand/dialogs/useGroupInsightsDialogStore"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"
import shallow from "zustand/shallow"
import GroupInsightsDialogContent from "./GroupInsightsDialogContent/GroupInsightsDialogContent"

const GroupInsightsDialog = () => {
  const [dialogIsOpen, closeDialog, group] = useGroupInsightsDialogStore(
    (s) => [s.dialogIsOpen, s.closeDialog, s.group],
    shallow
  )

  return (
    <Dialog
      onClose={closeDialog}
      open={dialogIsOpen}
      fullWidth
      maxWidth="sm"
      aria-labelledby="group-dialog"
    >
      <Box pb={1}>
        <DialogTitle id="group-dialog-title">
          <FlexVCenter justifyContent="space-between">
            <Typography variant="h5">Insights - {group?.name}</Typography>
          </FlexVCenter>
        </DialogTitle>

        <DialogContent>
          {group && <GroupInsightsDialogContent group={group} />}
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default GroupInsightsDialog
