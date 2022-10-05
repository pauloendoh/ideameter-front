import { MoveIdeasToTabDto } from "@/types/domain/idea/MoveIdeasToTabDto"
import create from "zustand"

interface IMoveIdeasToTabDialogStore {
  initialValue: MoveIdeasToTabDto
  dialogIsOpen: boolean
  openDialog: (ideaIds: string[]) => void
  closeDialog: () => void
}

const useMoveIdeasToTabDialogStore = create<IMoveIdeasToTabDialogStore>(
  (set, get) => ({
    initialValue: { ideaIds: [], tabId: "" },
    dialogIsOpen: false,
    openDialog: (ideaIds) => {
      set({
        dialogIsOpen: true,
        initialValue: {
          ideaIds,
          tabId: "",
        },
      })
    },
    closeDialog: () => set({ dialogIsOpen: false }),
  })
)

export default useMoveIdeasToTabDialogStore
