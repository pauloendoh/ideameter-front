import { styled, Table, TableHead } from "@mui/material";

const S = {
  Table: styled(Table)`
    td,
    th {
      padding: 12px;
    }
  `,
  TableHead: styled(TableHead)`
    th {
      background-color: unset;
      font-weight: bold;
    }
  `,
};

export default S;
