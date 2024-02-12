import { TableCell, TableRow } from "@mui/material"
import React from "react"
import S from "./AssignedIdeasTableHead.styles"

export type Header = {
  title: string
  reactNode?: React.ReactNode
  width?: number
  align: "left" | "right" | "center"
}

type Props = {
  headers: Header[]
}

const AssignedIdeasTableHead = ({ headers }: Props) => (
  <S.TableHead>
    <TableRow>
      {headers.map(({ title, width, align, reactNode }, index) => (
        <TableCell key={title} width={width ?? 0} align={align}>
          {reactNode ?? title}
        </TableCell>
      ))}
    </TableRow>
  </S.TableHead>
)

export default AssignedIdeasTableHead
