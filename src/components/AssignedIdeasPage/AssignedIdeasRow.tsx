import { TableCell } from "@mui/material"
import S from "./AssignedIdeasPage.styles"
import { AssignedToMeTypes } from "@/types/domain/idea/AssignedToMeTypes"

export const AssignedIdeasRow = ({ group, idea, tab }: AssignedToMeTypes) => {
  return (
    <S.TableRow id={idea.id} className="idea-table-row" hover>
      <TableCell align="center">1</TableCell>
      <TableCell>{idea.name}</TableCell>
      <TableCell>{group.name}</TableCell>
      <TableCell>{tab.name}</TableCell>
    </S.TableRow>
  )
}
