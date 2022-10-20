import TabDto, { buildTabDto } from "@/types/domain/group/tab/TabDto"
import create from "zustand"

interface IConfirmTabDialogStore {
  tabValue: TabDto
  dialogIsOpen: boolean
  onConfirm: () => void
  openDialog: (initialValue: TabDto, onConfirm: () => void) => void
  closeDialog: () => void
}

const useConfirmDeleteTabDialogStore = create<IConfirmTabDialogStore>((set, get) => ({
  tabValue: buildTabDto(),
  onConfirm: () => {},
  dialogIsOpen: false,
  openDialog: (tabValue, onConfirm) => {
    set({ dialogIsOpen: true, tabValue, onConfirm })
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}))

export default useConfirmDeleteTabDialogStore
