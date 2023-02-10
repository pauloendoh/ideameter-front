import IdeaDto, { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import create from "zustand"

interface IIdeaDialogStore {
  initialValue: IdeaDto
  dialogIsOpen: boolean
  openDialog: (initialValue: IdeaDto) => void
  closeDialog: () => void
}

const useIdeaDialogStore = create<IIdeaDialogStore>((set, get) => ({
  initialValue: buildIdeaDto(),
  confirasdmDialogValue: { title: "", onConfirm: () => {} },
  dialogIsOpen: false,
  openDialog: (initialValue) => {
    set({ dialogIsOpen: true, initialValue })
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}))

export default useIdeaDialogStore
