import { resetAuthStore } from "../../zustand/domain/auth/useAuthStore";

export const useLogout = () => {
  const logout = () => {
    resetAuthStore();
  };
  return logout;
};
