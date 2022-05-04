import TabDto, { newTabDto } from "@/types/domain/group/tab/TabDto";
import create from "zustand";

interface ITabDialogStore {
  initialValue: TabDto;
  dialogIsOpen: boolean;
  openDialog: (initialValue: TabDto) => void;
  closeDialog: () => void;
}

const useConfirmDialogStore = create<ITabDialogStore>((set, get) => ({
  initialValue: newTabDto(),
  confirmDialogValue: { title: "", onConfirm: () => {} },
  dialogIsOpen: false,
  openDialog: (initialValue) => {
    set({ dialogIsOpen: true, initialValue });
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}));

interface IConfirmDialog {
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
}

export default useConfirmDialogStore;
