import { Button, styled } from "@mui/material";

const S = {
  RootButton: styled(Button)`
    background: ${({ theme }) => theme.palette.grey[800]};
  `,
};

export default S;
