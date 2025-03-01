import create from "zustand"

type DialogValues = {
  rating: number | null
  groupId: string
  ideaId: string
}

interface IStore {
  initialValues: DialogValues
  isOpen: boolean
  openDialog: (params: {
    initialValue: DialogValues
    onSave: (newRating: number) => void
  }) => void
  close: () => void
  onSave: (newRating: number) => void
}

export const useRateYourInterestDialogStore = create<IStore>((set, get) => ({
  initialValues: {
    rating: null,
    groupId: "",
    ideaId: "",
  },
  isOpen: false,
  openDialog: (params) => {
    set({
      isOpen: true,
      initialValues: params.initialValue,
      onSave: params.onSave,
    })
  },
  close: () => set({ isOpen: false }),
  onSave: () => {},
}))
