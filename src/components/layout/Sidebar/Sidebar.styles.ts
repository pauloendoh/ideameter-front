import { Box, styled } from "@mui/material";

const S = {
  SelectedGroupLittleBar: styled(Box)`
    position: absolute;
    height: 100%;
    width: 8px;
    border-radius: 4px 0px 0px 4px;
    right: -20px;
    background: ${({ theme }) => theme.palette.primary.main};
  `,
};

export default S;
