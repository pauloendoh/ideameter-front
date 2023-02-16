import { TableCell, TableRow } from "@mui/material"
import S from "./AssignedIdeasTableHead.styles"

export type Header = {
  header: string
  width?: number
  align: "left" | "right" | "center"
}

type HeadProps = {
  headers: Header[]
}

const AssignedIdeasTableHead = ({ headers }: HeadProps) => (
  <S.TableHead>
    <TableRow>
      {headers.map(({ header, width, align }, index) => (
        <TableCell key={header + index} width={width || 0} align={align}>
          {header}
        </TableCell>
      ))}
    </TableRow>
  </S.TableHead>
)

export default AssignedIdeasTableHead
