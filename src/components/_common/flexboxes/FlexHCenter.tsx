import { Box } from "@mui/material";
import React from "react";

// PE 3/3
const FlexHCenter = (props: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      {props.children}
    </Box>
  );
};

type Props = React.ComponentProps<typeof Box>;

export default FlexHCenter;
