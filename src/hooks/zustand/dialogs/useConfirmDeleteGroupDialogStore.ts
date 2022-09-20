import GroupDto, { newGroupDto } from "@/types/domain/group/GroupDto"
import create from "zustand"

interface IConfirmDeleteGroupDialogStore {
  group: GroupDto
  dialogIsOpen: boolean
  onConfirm: () => void
  openDialog: (initialValue: GroupDto, onConfirm: () => void) => void
  closeDialog: () => void
}

const useConfirmDeleteGroupDialogStore = create<IConfirmDeleteGroupDialogStore>(
  (set, get) => ({
    group: newGroupDto(),
    onConfirm: () => {},
    dialogIsOpen: false,
    openDialog: (tabValue, onConfirm) => {
      set({ dialogIsOpen: true, group: tabValue, onConfirm })
    },
    closeDialog: () => set({ dialogIsOpen: false }),
  })
)

export default useConfirmDeleteGroupDialogStore
