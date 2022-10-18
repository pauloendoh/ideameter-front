import { TableBody, TableCell } from "@mui/material"
import S from "./AssignedIdeasTableBody.styles"
import { AssignedToMeTypes } from "@/types/domain/idea/AssignedToMeTypes"

type AssignedToMeBodyProps = { ideas: AssignedToMeTypes[] }

const AssignedIdeasTableBody = ({ ideas }: AssignedToMeBodyProps) => {
  return (
    <TableBody>
      {ideas.map(({ group, tab, idea }, index) => (
        <S.TableRow id={idea.id} className="idea-table-row" hover>
          <TableCell align="center">{index + 1}</TableCell>
          <TableCell>{idea.name}</TableCell>
          <TableCell>{group.name}</TableCell>
          <TableCell>{tab.name}</TableCell>
        </S.TableRow>
      ))}
    </TableBody>
  )
}

export default AssignedIdeasTableBody
