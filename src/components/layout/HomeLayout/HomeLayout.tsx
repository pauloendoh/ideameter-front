import Flex from "@/components/_common/flexboxes/Flex";
import { Box } from "@mui/material";
import React from "react";
import GlobalDialogs from "../dialogs/GlobalDialogs/GlobalDialogs";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

interface Props {
  children?: React.ReactNode;
}

const HomeLayout = (props: Props) => {
  return (
    <div>
      <Navbar />

      <Flex>
        <Sidebar />

        <Box sx={{ mt: 10, flexGrow: 1 }}>{props.children}</Box>

        <GlobalDialogs />
      </Flex>
    </div>
  );
};

export default HomeLayout;
