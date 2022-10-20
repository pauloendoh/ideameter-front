import TabDto, { buildTabDto } from "@/types/domain/group/tab/TabDto"
import create from "zustand"

interface ITabDialogStore {
  initialValue: TabDto
  dialogIsOpen: boolean
  openDialog: (initialValue: TabDto) => void
  closeDialog: () => void
}

const useTabDialogStore = create<ITabDialogStore>((set, get) => ({
  initialValue: buildTabDto(),
  dialogIsOpen: false,
  openDialog: (initialValue) => {
    set({ dialogIsOpen: true, initialValue })
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}))

export default useTabDialogStore
