import { Button } from "@mui/material";
import React from "react";
import S from "./DarkButton.styles";

// PE 3/3
const DarkButton = (props: Props) => {
  return (
    <S.RootButton {...props} sx={{ color: "white", ...props.sx }}>
      {props.children}
    </S.RootButton>
  );
};

type Props = React.ComponentProps<typeof Button>;

export default DarkButton;
