import Flex from "@/components/_common/flexboxes/Flex"
import LabelDto from "@/types/domain/label/LabelDto"
import styled from "@emotion/styled"
import { Checkbox, IconButton, Typography } from "@mui/material"
import { Draggable } from "react-beautiful-dnd"
import { MdEdit } from "react-icons/md"

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
  isDragging: boolean
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  border-radius: 4px;
  padding: 4px 8px;
  background: ${(props: ContainerProps) => props.bgColor};

  justify-content: space-between;
`

const SelectLabelItem = (props: Props) => {
  return (
    <Draggable draggableId={props.label.id} index={props.index}>
      {(provided, snapshot) => (
        <Flex
          gap={0.5}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div>
            <Checkbox
              checked={props.labelIsSelected}
              onClick={(e) => {
                e.stopPropagation()
                props.handleClick(props.label)
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
          </div>

          <Container
            bgColor={props.label.bgColor}
            onClick={() => props.handleClick(props.label)}
            isDragging={snapshot.isDragging}
            ref={provided.innerRef}
          >
            <Typography>{props.label.name}</Typography>
          </Container>

          <div>
            <IconButton size="small" onClick={() => props.onEdit(props.label)}>
              <MdEdit />
            </IconButton>
          </div>
        </Flex>
      )}
    </Draggable>
  )
}

export default SelectLabelItem
