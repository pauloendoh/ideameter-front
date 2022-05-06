import GroupDto, { newGroupDto } from "@/types/domain/group/GroupDto";
import create from "zustand";

interface IGroupDialogStore {
  initialValue: GroupDto;
  isOpen: boolean;
  openDialog: (initialValue: GroupDto) => void;
  close: () => void;
}

const useGroupDialogStore = create<IGroupDialogStore>((set, get) => ({
  initialValue: newGroupDto(),
  isOpen: false,
  openDialog: (initialValue) => {
    set({ isOpen: true, initialValue });
  },
  close: () => set({ isOpen: false }),
}));

export default useGroupDialogStore;
