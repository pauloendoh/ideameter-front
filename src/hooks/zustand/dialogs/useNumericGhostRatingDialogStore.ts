import create from "zustand"

type DialogValues = {
  rating: number | null
  groupId: string
  ideaId: string
  targetUserId: string
}

interface IStore {
  initialValues: DialogValues
  isOpen: boolean
  openDialog: (params: { initialValue: DialogValues }) => void
  close: () => void
}

export const useNumericGhostRatingDialogStore = create<IStore>((set, get) => ({
  initialValues: {
    rating: null,
    groupId: "",
    ideaId: "",
    targetUserId: "",
  },
  isOpen: false,
  openDialog: (params) => {
    set({
      isOpen: true,
      initialValues: params.initialValue,
    })
  },
  close: () => set({ isOpen: false }),
}))
