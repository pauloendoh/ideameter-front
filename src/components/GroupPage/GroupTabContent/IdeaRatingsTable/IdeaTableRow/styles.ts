import { styled, TableRow } from "@mui/material";

export const S = {
  TableRow: styled(TableRow)(({ theme }) => ({
    "& .highlight-idea-row": {
      transition: "all .5s",
      background: theme.palette.primary.main,
    },
  })),
};
