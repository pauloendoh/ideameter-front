import create from "zustand"

export interface IInitialValue {
  newParentIdeaTitle: string
  ideaId: string
  afterClose: () => void
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
    afterClose: () => {},
  },
  dialogIsOpen: false,
  openDialog: (initialValue) => {
    set({ dialogIsOpen: true, initialValue })
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}))

export default useTransformToSubideadialogStore
