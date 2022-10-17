import { styled, Table, TableCell, TableHead, TableRow } from "@mui/material"

const S = {
  Table: styled(Table)`
    td,
    th {
      padding: 8px;
    }
  `,
  // TableHead: styled(TableHead)`
  //   th {
  //     background-color: #242424;
  //     font-weight: bold;
  //     padding: 3px;
  //   }

  TableHead: styled(TableHead)`
    th {
      background-color: #242424;
      font-weight: bold;
      padding-top: 3px;
      padding-bottom: 3px;
      border-bottom: none;
    }
  `,

  TableRow: styled(TableRow)`
    .MuiTableCell-root {
      border-bottom: none;
    }
  `,
}

export default S
