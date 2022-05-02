import styled from "@emotion/styled";
import { AppBar, Toolbar } from "@mui/material";

const S = {
  AppBarRoot: styled(AppBar)`
    flex-grow: 1;
    background: #202020;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  `,
  NavbarToolbar: styled(Toolbar)`
    min-height: 72px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
};

export default S;
