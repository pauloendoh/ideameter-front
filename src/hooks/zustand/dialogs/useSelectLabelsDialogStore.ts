import LabelDto from "@/types/domain/label/LabelDto"
import create from "zustand"

interface IStore {
  selectedLabels: LabelDto[]
  setSelectedLabels: (newLabels: LabelDto[]) => void
  groupId: string
  onChangeSelectedLabels: (newLabels: LabelDto[]) => void
  openDialog: (initialValue: {
    groupId: string
    selectedLabels: LabelDto[]
    onChangeSelectedLabels: (newLabels: LabelDto[]) => void
  }) => void
  dialogIsOpen: boolean
  closeDialog: () => void
}

const useSelectLabelsDialogStore = create<IStore>((set, get) => ({
  groupId: "",
  selectedLabels: [],
  setSelectedLabels: (newLabels: LabelDto[]) => {
    set({
      selectedLabels: newLabels,
    })
  },

  onChangeSelectedLabels: (newLabels: LabelDto[]) => {},
  openDialog: (initialValue: {
    groupId: string
    selectedLabels: LabelDto[]
    onChangeSelectedLabels: (newLabels: LabelDto[]) => void
  }) => {
    set({
      groupId: initialValue.groupId,
      onChangeSelectedLabels: initialValue.onChangeSelectedLabels,
      dialogIsOpen: true,
    })
  },
  dialogIsOpen: false,
  closeDialog: () => {
    set({
      dialogIsOpen: false,
    })
  },
}))

export default useSelectLabelsDialogStore
