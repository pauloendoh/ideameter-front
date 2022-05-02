import { Box } from "@mui/material";
import React from "react";

// PE 3/3
const Flex = (props: Props) => {
  return (
    <Box display="flex" {...props}>
      {props.children}
    </Box>
  );
};

type Props = React.ComponentProps<typeof Box>;

export default Flex;
