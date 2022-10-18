import { TableCell } from "@mui/material"
import S from "./AssignedIdeasRow.styles"
import { AssignedToMeTypes } from "@/types/domain/idea/AssignedToMeTypes"

type AssignedIdeasRowTypes = AssignedToMeTypes & {
  index: number
}

const AssignedIdeasRow = ({ group, idea, tab, index }: AssignedIdeasRowTypes) => {
  return (
    <S.TableRow id={idea.id} className="idea-table-row" hover>
      <TableCell align="center">{index + 1}</TableCell>
      <TableCell>{idea.name}</TableCell>
      <TableCell>{group.name}</TableCell>
      <TableCell>{tab.name}</TableCell>
    </S.TableRow>
  )
}

export default AssignedIdeasRow
