import useImportLabelsDialogStore from "@/hooks/zustand/dialogs/useImportLabelsDialogStore"
import useSelectLabelsDialogStore from "@/hooks/zustand/dialogs/useSelectLabelsDialogStore"
import ConfirmDeleteGroupDialog from "../ConfirmDeleteGroupDialog/ConfirmDeleteGroupDialog"
import ConfirmDeleteTabDialog from "../ConfirmDeleteTabDialog/ConfirmDeleteTabDialog"
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog"
import EditLabelDialog from "../EditLabelDialog/EditLabelDialog"
import EditProfileDialog from "../EditProfileDialog/EditProfileDialog"
import GroupDialog from "../GroupDialog/GroupDialog"
import GroupInsightsDialog from "../GroupInsightsDialog/GroupInsightsDialog"
import IdeaAssignDialog from "../IdeaAssignDialog/IdeaAssignDialog"
import IdeaDialog from "../IdeaDialog/IdeaDialog"
import SubideaDialog from "../IdeaDialog/SubideaDialog/SubideaDialog"
import ImportLabelsDialog from "../ImportLabelsDialog/ImportLabelsDialog"
import MoveIdeasToTabDialog from "../MoveIdeasToTabDialog/MoveIdeasToTabDialog"
import SelectLabelsDialog from "../SelectLabelsDialog/SelectLabelsDialog"
import ShortcutsDialog from "../ShortcutsDialog/ShortcutsDialog"
import TabDialog from "../TabDialog/TabDialog"
import TransformToSubideaDialog from "../TransformToSubideaDialog/TransformToSubideaDialog"

// each one is managed by zustand
// PE 1/3 - use lazy import?
const GlobalDialogs = () => {
  const importLabelsDialog = useImportLabelsDialogStore()
  const selectLabelsDialogStore = useSelectLabelsDialogStore()

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

      <GroupInsightsDialog />
      <MoveIdeasToTabDialog />
      <ImportLabelsDialog
        closeDialog={importLabelsDialog.closeDialog}
        dialogIsOpen={importLabelsDialog.dialogIsOpen}
      />

      <SelectLabelsDialog
        groupId={selectLabelsDialogStore.groupId}
        selectedLabels={selectLabelsDialogStore.selectedLabels}
        onChangeSelectedLabels={selectLabelsDialogStore.onChangeSelectedLabels}
        open={selectLabelsDialogStore.dialogIsOpen}
        onClose={selectLabelsDialogStore.closeDialog}
      />

      <TransformToSubideaDialog />
    </>
  )
}

export default GlobalDialogs
