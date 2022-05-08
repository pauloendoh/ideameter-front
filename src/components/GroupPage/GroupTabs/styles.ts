import { styled, Tabs } from "@mui/material";

const S = {
  Tabs: styled(Tabs)`
    & .MuiTab-root {
      opacity: 100%;
    }

    button {
      padding: 12px 16px 12px 0px;
    }
  `,
};

export default S;
