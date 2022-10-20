import LabelDto, { buildLabelDto } from "@/types/domain/label/LabelDto"
import create from "zustand"

interface IEditLabelDialogStore {
  initialValue: LabelDto
  dialogIsOpen: boolean
  openDialog: (initialValue: LabelDto) => void
  closeDialog: () => void
}

const useEditLabelDialogStore = create<IEditLabelDialogStore>((set, get) => ({
  initialValue: buildLabelDto(),
  dialogIsOpen: false,
  openDialog: (initialValue) => {
    set({ dialogIsOpen: true, initialValue })
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}))

export default useEditLabelDialogStore
