import create from "zustand"

export interface IIdeaChangesDialogValue {
  ideaTitle: string
  ideaId: string
}

interface IStore {
  initialValue: IIdeaChangesDialogValue
  dialogIsOpen: boolean
  openDialog: (initialValue: IIdeaChangesDialogValue) => void
  closeDialog: () => void
}

const useIdeaChangesDialogStore = create<IStore>((set, get) => ({
  initialValue: {
    ideaId: "",
    ideaTitle: "",
  },
  dialogIsOpen: false,
  openDialog: (initialValue) => {
    set({ dialogIsOpen: true, initialValue })
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}))

export default useIdeaChangesDialogStore
