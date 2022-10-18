import { TableCell, TableRow } from "@mui/material"
import S from "./AssignedIdeasTableHead.styles"

const AssignedIdeasTableHead = ({ headers }: { headers: any }) => (
  <S.TableHead>
    <TableRow>
      {headers.map(({ header, width }: { header: any; width: any }) => (
        <TableCell width={width || 0}>{header}</TableCell>
      ))}
    </TableRow>
  </S.TableHead>
)

export default AssignedIdeasTableHead
