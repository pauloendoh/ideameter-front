import React from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import GroupDialog from "../GroupDialog/GroupDialog";
import TabDialog from "../TabDialog/TabDialog";

// managed by zustand
const GlobalDialogs = () => {
  return (
    <>
      <ConfirmDialog />
      <TabDialog />
      <GroupDialog />
    </>
  );
};

export default GlobalDialogs;
