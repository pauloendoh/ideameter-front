import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useGroupLabelsQuery from "@/hooks/react-query/domain/label/useGroupLabelsQuery"
import useEditLabelDialogStore from "@/hooks/zustand/dialogs/useEditLabelDialogStore"
import LabelDto, { newLabelDto } from "@/types/domain/label/LabelDto"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import { useMemo } from "react"
import { MdCheck, MdClose, MdEdit } from "react-icons/md"

const ariaLabel = "select-labels-dialog"

interface Props {
  groupId: string

  selectedLabels: LabelDto[]
  onChangeSelectedLabels: (newLabels: LabelDto[]) => void
  open: boolean
  onClose: () => void
}

const SelectLabelsDialog = (props: Props) => {
  const { data: groupLabels } = useGroupLabelsQuery(props.groupId)
  const { openDialog: openEditLabelDialog } = useEditLabelDialogStore()

  const sortedLabels = useMemo(() => {
    if (!groupLabels) return []
    return groupLabels.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }, [groupLabels])

  const handleClick = (label: LabelDto) => {
    const newLabels = pushOrRemove([...props.selectedLabels], label, "id")

    props.onChangeSelectedLabels(newLabels)
  }

  const labelIsSelected = (label: LabelDto) => {
    return props.selectedLabels.find((l) => l.id === label.id)
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
          <FlexCol gap={1}>
            {sortedLabels.map((label) => (
              <FlexVCenter key={label.id} gap={0.5}>
                <FlexVCenter
                  onClick={() => handleClick(label)}
                  sx={{
                    flexGrow: 1,
                    borderRadius: "4px",
                    padding: "4px 8px",
                    background: label.bgColor,
                    cursor: "pointer",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>{label.name}</Typography>
                  {labelIsSelected(label) && <MdCheck />}
                </FlexVCenter>

                <IconButton size="small" onClick={() => openEditLabelDialog(label)}>
                  <MdEdit />
                </IconButton>
              </FlexVCenter>
            ))}
          </FlexCol>
          <DarkButton
            sx={{ mt: 2 }}
            fullWidth
            onClick={() => openEditLabelDialog(newLabelDto(props.groupId))}
          >
            + Create new label
          </DarkButton>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default SelectLabelsDialog
