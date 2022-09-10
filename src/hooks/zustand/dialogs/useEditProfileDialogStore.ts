import AuthUserGetDto, {
  buildAuthUserGetDto,
} from "@/types/domain/auth/AuthUserGetDto";
import create from "zustand";

interface IEditProfileDialogStore {
  initialValue: AuthUserGetDto;
  dialogIsOpen: boolean;
  openDialog: (initialValue: AuthUserGetDto) => void;
  closeDialog: () => void;
}

const useEditProfileDialogStore = create<IEditProfileDialogStore>(
  (set, get) => ({
    initialValue: buildAuthUserGetDto(),
    dialogIsOpen: false,
    openDialog: (initialValue) => {
      set({ dialogIsOpen: true, initialValue });
    },
    closeDialog: () => set({ dialogIsOpen: false }),
  })
);

export default useEditProfileDialogStore;
