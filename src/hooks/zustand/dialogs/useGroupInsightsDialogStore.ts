import GroupDto from "@/types/domain/group/GroupDto"
import create from "zustand"

interface IGroupInsightsDialogStore {
  group: GroupDto | null
  dialogIsOpen: boolean
  openDialog: (group: GroupDto) => void
  closeDialog: () => void
}

const useGroupInsightsDialogStore = create<IGroupInsightsDialogStore>(
  (set, get) => ({
    group: null,
    dialogIsOpen: false,
    openDialog: (group) => {
      set({ dialogIsOpen: true, group })
    },
    closeDialog: () => set({ dialogIsOpen: false }),
  })
)

export default useGroupInsightsDialogStore
