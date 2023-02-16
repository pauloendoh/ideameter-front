import { MenuItem, styled, Typography } from "@mui/material"

const S = {
  MenuItem: styled(MenuItem)`
    display: flex;
    gap: 4;
    padding-top: 0;
    padding-bottom: 0;
  `,
  CheckboxLabel: styled(Typography)`
    padding: 4px 8px;
    flex-grow: 1;
    white-space: normal;
  `,
}

export default S
