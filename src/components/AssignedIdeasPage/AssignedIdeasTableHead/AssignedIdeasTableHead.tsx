import { TableCell, TableHead, TableRow } from "@mui/material"
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
    {headers.map(({ header, width }) => (
      <TableCell width={width || 0}>{header}</TableCell>
    ))}
  </S.TableHead>
)

export default AssignedIdeasTableHead
