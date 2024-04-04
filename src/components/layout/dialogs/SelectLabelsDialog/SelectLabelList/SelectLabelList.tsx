import useEditLabelDialogStore from "@/hooks/zustand/dialogs/useEditLabelDialogStore"
import LabelDto from "@/types/domain/label/LabelDto"
import { pushOrRemove } from "endoh-utils"
import { Droppable } from "react-beautiful-dnd"
import SelectLabelItem from "../SelectLabelItem/SelectLabelItem"

interface Props {
  groupId: string
  selectedLabels: LabelDto[]
  onChangeSelectedLabels: (newLabels: LabelDto[]) => void
  sortedLabels: LabelDto[]
}

const SelectLabelList = (props: Props) => {
  const { openDialog: openEditLabelDialog } = useEditLabelDialogStore()

  const handleClick = (label: LabelDto) => {
    const newLabels = pushOrRemove([...props.selectedLabels], label, "id")

    props.onChangeSelectedLabels(newLabels)
  }

  const labelIsSelected = (label: LabelDto) => {
    return !!props.selectedLabels.find((l) => l.id === label.id)
  }

  return (
    <Droppable droppableId="hello">
      {(provided) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {props.sortedLabels.map((label, index) => (
            <SelectLabelItem
              key={label.id}
              label={label}
              handleClick={handleClick}
              labelIsSelected={labelIsSelected(label)}
              onEdit={() => openEditLabelDialog(label)}
              index={index}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default SelectLabelList
