import create from "zustand"

export interface IInitialValue {
  newParentIdeaTitle: string
  ideaId: string
}

interface IStore {
  initialValue: IInitialValue
  dialogIsOpen: boolean
  openDialog: (initialValue: IInitialValue) => void
  closeDialog: () => void
}

const useTransformToSubideadialogStore = create<IStore>((set, get) => ({
  initialValue: {
    ideaId: "",
    newParentIdeaTitle: "",
  },
  dialogIsOpen: false,
  openDialog: (initialValue) => {
    set({ dialogIsOpen: true, initialValue })
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}))

export default useTransformToSubideadialogStore
