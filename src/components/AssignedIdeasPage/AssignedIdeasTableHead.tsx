import { TableCell, TableRow } from "@mui/material"
import S from "./AssignedIdeasPage.styles"

export const AssignedIdeasTableHead = ({ headers }: { headers: any }) => (
  <S.TableHead>
    <TableRow>
      {headers.map(({ header, width }: { header: any; width: any }) => (
        <TableCell width={width || 0}>{header}</TableCell>
      ))}
    </TableRow>
  </S.TableHead>
)
