import create from "zustand";

interface IConfirmDialogStore {
  confirmDialogValue: IConfirmDialog;
  confirmDialogIsOpen: boolean;
  openConfirmDialog: (confirmDialog: IConfirmDialog) => void;
  closeConfirmDialog: () => void;
}

const useConfirmDialogStore = create<IConfirmDialogStore>((set, get) => ({
  confirmDialogValue: { title: "", onConfirm: () => {} },
  confirmDialogIsOpen: false,
  openConfirmDialog: (val) => {
    set({ confirmDialogValue: val, confirmDialogIsOpen: true });
  },
  closeConfirmDialog: () => set({ confirmDialogIsOpen: false }),
}));

interface IConfirmDialog {
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
}

export default useConfirmDialogStore;
