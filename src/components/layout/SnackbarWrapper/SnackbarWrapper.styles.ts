import { Box } from "@mui/material";
import { styled } from "@mui/system";

export default {
  Root: styled(Box)`
    width: 100%;
    & > * + * {
      margin-top: ${(props) => props.theme.spacing(2)};
    }
  `,
};
