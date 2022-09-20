import ConfirmDeleteGroupDialog from "../ConfirmDeleteGroupDialog/ConfirmDeleteGroupDialog"
import ConfirmDeleteTabDialog from "../ConfirmDeleteTabDialog/ConfirmDeleteTabDialog"
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog"
import EditLabelDialog from "../EditLabelDialog/EditLabelDialog"
import EditProfileDialog from "../EditProfileDialog/EditProfileDialog"
import GroupDialog from "../GroupDialog/GroupDialog"
import IdeaAssignDialog from "../IdeaAssignDialog/IdeaAssignDialog"
import IdeaDialog from "../IdeaDialog/IdeaDialog"
import SubideaDialog from "../IdeaDialog/SubideaDialog/SubideaDialog"
import ShortcutsDialog from "../ShortcutsDialog/ShortcutsDialog"
import TabDialog from "../TabDialog/TabDialog"

// each one is managed by zustand
const GlobalDialogs = () => {
  return (
    <>
      <ConfirmDialog />
      <TabDialog />
      <GroupDialog />
      <IdeaDialog />
      <EditLabelDialog />

      <EditProfileDialog />
      <IdeaAssignDialog />
      <SubideaDialog />
      <ShortcutsDialog />
      <ConfirmDeleteTabDialog />
      <ConfirmDeleteGroupDialog />
    </>
  )
}

export default GlobalDialogs
