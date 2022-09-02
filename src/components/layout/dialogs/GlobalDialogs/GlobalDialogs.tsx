import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import EditLabelDialog from "../EditLabelDialog/EditLabelDialog";
import GroupDialog from "../GroupDialog/GroupDialog";
import IdeaAssignDialog from "../IdeaAssignDialog/IdeaAssignDialog";
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

      <IdeaAssignDialog />
    </>
  );
};

export default GlobalDialogs;
