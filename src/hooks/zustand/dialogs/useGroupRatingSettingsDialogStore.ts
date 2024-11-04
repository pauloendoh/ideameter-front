import GroupDto, { newGroupDto } from "@/types/domain/group/GroupDto"
import create from "zustand"

interface IStore {
  initialValue: GroupDto
  isOpen: boolean
  openDialog: (params: {
    initialValue: GroupDto
    onSave: (values: GroupDto) => void
  }) => void
  close: () => void
  onSave: (values: GroupDto) => void
}

export const useGroupRatingSettingsDialogStore = create<IStore>((set, get) => ({
  initialValue: newGroupDto(),
  isOpen: false,
  openDialog: (params) => {
    set({
      isOpen: true,
      initialValue: params.initialValue,
      onSave: params.onSave,
    })
  },
  close: () => set({ isOpen: false }),
  onSave: () => {},
}))
