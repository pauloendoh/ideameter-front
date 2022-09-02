import { Box, styled } from "@mui/material";

const S = {
  SelectedGroupLittleBar: styled(Box)`
    position: absolute;
    height: 100%;
    width: 8px;

    border-radius: 0px 4px 4px 0px;
    left: -20px;
    background: ${({ theme }) => theme.palette.primary.main};
  `,
};

export default S;
