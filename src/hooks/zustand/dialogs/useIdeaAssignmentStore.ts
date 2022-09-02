import SimpleUserDto from "@/types/domain/user/SimpleUserDto";
import create from "zustand";

interface IIdeaAssignmentStore {
  initialValues: SimpleUserDto[];
  onChange: (newValue: SimpleUserDto[]) => void;
  dialogIsOpen: boolean;
  openDialog: (
    initialValues: SimpleUserDto[],
    onChange: (newValue: SimpleUserDto[]) => void
  ) => void;
  closeDialog: () => void;
}

const useIdeaAssignmentStore = create<IIdeaAssignmentStore>((set, get) => ({
  initialValues: [],
  onChange: () => {},

  dialogIsOpen: false,
  openDialog: (initialValues, onChange) => {
    set({
      dialogIsOpen: true,
      initialValues,
      onChange,
    });
  },
  closeDialog: () => set({ dialogIsOpen: false }),
}));

export default useIdeaAssignmentStore;
