import create from "zustand"

export interface IInitialValue {
  selectedIdeaIds: string[]
  groupId: string
}

interface IStore {
  initialValue: IInitialValue
  dialogIsOpen: boolean
  openDialog: (initialValue: IInitialValue) => void
  closeDialog: () => void
}

export const useAddLabelsToIdeasDialogStore = create<IStore>((set, get) => ({
  initialValue: {
    selectedIdeaIds: [],
    groupId: "",
  },
  dialogIsOpen: false,
  openDialog: (initialValue) => {
    set({ dialogIsOpen: true, initialValue })
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}))
