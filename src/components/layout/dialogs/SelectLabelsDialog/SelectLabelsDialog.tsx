import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useGroupLabelsQuery from "@/hooks/react-query/domain/label/useGroupLabelsQuery"
import useSaveLabelsBatchMutation from "@/hooks/react-query/domain/label/useSaveLabelsBatchMutation"
import useEditLabelDialogStore from "@/hooks/zustand/dialogs/useEditLabelDialogStore"
import LabelDto, { buildLabelDto } from "@/types/domain/label/LabelDto"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import { useMemo, useState } from "react"
import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd"
import { MdAdd, MdClose, MdImportExport } from "react-icons/md"
import ImportLabelsSection from "./ImportLabelsSection/ImportLabelsSection"
import SelectLabelList from "./SelectLabelList/SelectLabelList"

const ariaLabel = "select-labels-dialog"

interface Props {
  groupId: string

  selectedLabels: LabelDto[]
  onChangeSelectedLabels: (newLabels: LabelDto[]) => void
  open: boolean
  onClose: () => void
}

const SelectLabelsDialog = (props: Props) => {
  const { openDialog: openEditLabelDialog } = useEditLabelDialogStore()

  const [isImporting, setIsImporting] = useState(false)

  const { data: groupLabels } = useGroupLabelsQuery(props.groupId)

  const sortedLabels = useMemo(() => {
    return groupLabels?.sort((a, b) => a.position - b.position) || []
  }, [groupLabels])

  const { mutate: submitSaveLabelsBatch } = useSaveLabelsBatchMutation()

  const onDragEnd: OnDragEndResponder = (result) => {
    console.log({
      result,
    })

    const { destination, source } = result
    const fromIndex = source.index
    const toIndex = destination?.index

    if (toIndex === undefined) return

    const copiedSortedLabels = [...sortedLabels]
    const [removed] = copiedSortedLabels.splice(fromIndex, 1)
    copiedSortedLabels.splice(toIndex, 0, removed)

    const finalSortedLabels = copiedSortedLabels.map((label, index) => ({
      ...label,
      position: index + 1,
    }))

    submitSaveLabelsBatch(finalSortedLabels)
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      aria-labelledby={ariaLabel}
      PaperProps={{
        sx: { maxWidth: 300 },
      }}
    >
      <Box pb={1}>
        <DialogTitle id={`${ariaLabel}-title`}>
          <FlexVCenter justifyContent="space-between">
            <Typography variant="h5">Labels</Typography>

            <IconButton onClick={props.onClose}>
              <MdClose />
            </IconButton>
          </FlexVCenter>
        </DialogTitle>

        <DialogContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <SelectLabelList
              sortedLabels={sortedLabels}
              groupId={props.groupId}
              onChangeSelectedLabels={props.onChangeSelectedLabels}
              selectedLabels={props.selectedLabels}
            />
          </DragDropContext>
          <DarkButton
            sx={{ mt: 2 }}
            fullWidth
            onClick={() => openEditLabelDialog(buildLabelDto({ groupId: props.groupId }))}
            startIcon={<MdAdd />}
          >
            Create new label
          </DarkButton>

          {isImporting ? (
            <ImportLabelsSection close={() => setIsImporting(false)} />
          ) : (
            <DarkButton
              sx={{ mt: 1 }}
              fullWidth
              onClick={() => setIsImporting(true)}
              startIcon={<MdImportExport />}
            >
              Import from other project
            </DarkButton>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default SelectLabelsDialog
