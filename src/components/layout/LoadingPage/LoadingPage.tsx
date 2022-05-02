import FlexCenter from "@/components/_common/flexboxes/FlexCenter";
import { Box, CircularProgress } from "@mui/material";
import React from "react";

// PE 2/3 - should be at shared-components, and change it to /loading/LoadingBox
function LoadingPage() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100vh",
      }}
    >
      <FlexCenter flexDirection="column">
        <CircularProgress />
        <Box mt={2}>Loading</Box>
      </FlexCenter>
    </Box>
  );
}

export default LoadingPage;
