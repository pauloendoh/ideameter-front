import useSelectLabelsDialogStore from "@/hooks/zustand/dialogs/useSelectLabelsDialogStore"
import { AddLabelsToIdeasDialog } from "../AddLabelsToIdeasDialog/AddLabelsToIdeasDialog"
import ArchivedIdeasDialog from "../ArchivedIdeasDialog/ArchivedIdeasDialog"
import ConfirmDeleteGroupDialog from "../ConfirmDeleteGroupDialog/ConfirmDeleteGroupDialog"
import ConfirmDeleteTabDialog from "../ConfirmDeleteTabDialog/ConfirmDeleteTabDialog"
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog"
import EditLabelDialog from "../EditLabelDialog/EditLabelDialog"
import EditProfileDialog from "../EditProfileDialog/EditProfileDialog"
import GroupDialog from "../GroupDialog/GroupDialog"
import GroupInsightsDialog from "../GroupInsightsDialog/GroupInsightsDialog"
import GroupRatingSettingsDialog from "../GroupRatingSettingsDialog/GroupRatingSettingsDialog"
import HideTabsDialog from "../HideTabsDialog/HideTabsDialog"
import IdeaAssignDialog from "../IdeaAssignDialog/IdeaAssignDialog"
import IdeaChangesDialog from "../IdeaChangesDialog/IdeaChangesDialog"
import IdeaDialog from "../IdeaDialog/IdeaDialog"
import SubideaDialog from "../IdeaDialog/SubideaDialog/SubideaDialog"
import MoveIdeasToTabDialog from "../MoveIdeasToTabDialog/MoveIdeasToTabDialog"
import SelectLabelsDialog from "../SelectLabelsDialog/SelectLabelsDialog"
import ShortcutsDialog from "../ShortcutsDialog/ShortcutsDialog"
import TabDialog from "../TabDialog/TabDialog"
import TransformToSubideaDialog from "../TransformToSubideaDialog/TransformToSubideaDialog"

// each one is managed by zustand
const GlobalDialogs = () => {
  const selectLabelsDialogStore = useSelectLabelsDialogStore()

  return (
    <>
      <ConfirmDialog />
      <TabDialog />

      <GroupDialog />
      <GroupRatingSettingsDialog />

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

      <SelectLabelsDialog
        groupId={selectLabelsDialogStore.groupId}
        selectedLabels={selectLabelsDialogStore.selectedLabels}
        onChangeSelectedLabels={selectLabelsDialogStore.onChangeSelectedLabels}
        open={selectLabelsDialogStore.dialogIsOpen}
        onClose={selectLabelsDialogStore.closeDialog}
      />

      <TransformToSubideaDialog />
      <IdeaChangesDialog />
      <ArchivedIdeasDialog />
      <HideTabsDialog />

      <AddLabelsToIdeasDialog />
    </>
  )
}

export default GlobalDialogs
