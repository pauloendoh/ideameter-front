import create from "zustand"

interface IStore {
  dialogIsOpen: boolean
  openDialog: () => void
  closeDialog: () => void
}

const useArchivedIdeasDialogStore = create<IStore>((set, get) => ({
  dialogIsOpen: false,
  openDialog: () => {
    set({ dialogIsOpen: true })
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}))

export default useArchivedIdeasDialogStore
