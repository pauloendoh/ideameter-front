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
      background-color: #2b2b2b;
      font-weight: bold;
    }
  `,
};

export default S;
