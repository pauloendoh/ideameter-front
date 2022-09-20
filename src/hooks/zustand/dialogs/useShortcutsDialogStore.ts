import create from "zustand"

interface IShortcutsDialogStore {
  dialogIsOpen: boolean
  openDialog: () => void
  closeDialog: () => void
}

const useShortcutsDialogStore = create<IShortcutsDialogStore>((set, get) => ({
  dialogIsOpen: false,
  openDialog: () => {
    set({ dialogIsOpen: true })
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}))

export default useShortcutsDialogStore
