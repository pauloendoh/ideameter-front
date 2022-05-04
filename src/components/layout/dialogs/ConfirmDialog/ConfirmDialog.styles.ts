import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import { styled } from "@mui/material";

const S = {
  ButtonsWrapper: styled(FlexVCenter)`
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing(1)};
  `,
};

export default S;
