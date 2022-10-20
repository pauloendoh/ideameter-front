import IdeaDto, { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import create from "zustand"

interface ISubideaDialogStore {
  initialValue: IdeaDto
  dialogIsOpen: boolean
  openDialog: (initialValue: IdeaDto) => void
  closeDialog: () => void
}

const useSubideaDialogStore = create<ISubideaDialogStore>((set, get) => ({
  initialValue: buildIdeaDto(),
  confirmDialogValue: { title: "", onConfirm: () => {} },
  dialogIsOpen: false,
  openDialog: (initialValue) => {
    set({ dialogIsOpen: true, initialValue })
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}))

export default useSubideaDialogStore
