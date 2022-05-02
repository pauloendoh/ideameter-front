import create, { SetState } from "zustand";

interface ISnackBarStore {
  successMessage: string;
  setSuccessMessage: (message: string) => void;

  errorMessage: string;
  setErrorMessage: (message: string) => void;
}

const useSnackbarStore = create<ISnackBarStore>(
  (set: SetState<ISnackBarStore>) => ({
    successMessage: "",
    setSuccessMessage: (message) => {
      set({ successMessage: message });
    },

    errorMessage: "",
    setErrorMessage: (message) => {
      set({ errorMessage: message });
    },
  })
);

export default useSnackbarStore;
