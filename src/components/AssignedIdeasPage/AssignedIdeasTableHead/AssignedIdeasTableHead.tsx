import { TableCell, TableRow } from "@mui/material"
import S from "./AssignedIdeasTableHead.styles"

type Header = {
  header: string
  width?: number
}

type HeadProps = {
  headers: Header[]
}

const AssignedIdeasTableHead = ({ headers }: HeadProps) => (
  <S.TableHead>
    <TableRow>
      {headers.map(({ header, width }, index) => (
        <TableCell key={header + index} width={width || 0}>
          {header}
        </TableCell>
      ))}
    </TableRow>
  </S.TableHead>
)

export default AssignedIdeasTableHead
