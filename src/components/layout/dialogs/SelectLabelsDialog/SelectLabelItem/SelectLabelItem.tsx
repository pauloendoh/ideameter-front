import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import LabelDto from "@/types/domain/label/LabelDto"
import styled from "@emotion/styled"
import { IconButton, Typography } from "@mui/material"
import { Draggable } from "react-beautiful-dnd"
import { MdCheck, MdEdit } from "react-icons/md"

interface Props {
  handleClick: (label: LabelDto) => void
  label: LabelDto
  labelIsSelected?: boolean
  onEdit: (label: LabelDto) => void
  index: number
}

// with props
type ContainerProps = {
  bgColor: string
}
const Container = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  border-radius: 4px;
  padding: 4px 8px;
  background: ${(props: ContainerProps) => props.bgColor};
  cursor: pointer;
  justify-content: space-between;
`

const SelectLabelItem = (props: Props) => {
  return (
    <Draggable draggableId={props.label.id} index={props.index}>
      {(provided) => (
        <FlexVCenter gap={0.5}>
          <Container
            bgColor={props.label.bgColor}
            onClick={() => props.handleClick(props.label)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Typography>{props.label.name}</Typography>
            {props.labelIsSelected && <MdCheck />}
          </Container>

          <IconButton size="small" onClick={() => props.onEdit(props.label)}>
            <MdEdit />
          </IconButton>
        </FlexVCenter>
      )}
    </Draggable>
  )
}

export default SelectLabelItem
