import { MenuItem, styled } from "@mui/material";
import { Box } from "@mui/system";

const S = {
  MenuItem: styled(MenuItem)`
    display: flex;
    align-items: center;
    gap: 4;
    padding-top: 0;
    padding-bottom: 0;
  `,
  CheckboxLabel: styled(Box)`
    padding: 4px 8px;
    flex-grow: 1;
    min-width: 160px;
  `,
};

export default S;
