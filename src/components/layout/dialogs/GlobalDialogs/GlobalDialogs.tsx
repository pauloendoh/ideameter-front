import React from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import EditLabelDialog from "../EditLabelDialog/EditLabelDialog";
import GroupDialog from "../GroupDialog/GroupDialog";
import IdeaDialog from "../IdeaDialog/IdeaDialog";
import TabDialog from "../TabDialog/TabDialog";

// managed by zustand
const GlobalDialogs = () => {
  return (
    <>
      <ConfirmDialog />
      <TabDialog />
      <GroupDialog />
      <IdeaDialog />
      <EditLabelDialog />
    </>
  );
};

export default GlobalDialogs;
