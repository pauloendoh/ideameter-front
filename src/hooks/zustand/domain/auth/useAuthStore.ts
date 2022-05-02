import nookies from "nookies";
import AuthUserGetDto from "types/domain/auth/AuthUserGetDto";
import create, { GetState } from "zustand";
import { NamedSet } from "zustand/middleware";

interface IAuthStore {
  authUser: AuthUserGetDto | null;
  setAuthUser: (authUser: AuthUserGetDto) => void;
}

const useAuthStore = create<IAuthStore>(
  (set: NamedSet<IAuthStore>, get: GetState<IAuthStore>) => ({
    authUser: null,
    setAuthUser: (authUser) => {
      const expiresAt = new Date(authUser.expiresAt);

      nookies.set(null, "user", JSON.stringify(authUser), {
        secure: true,
        path: "/",
      });
      // localStorage.setItem("user", JSON.stringify(authUser));

      // Refresh logout timeout
      setTimeout(() => {
        return resetAuthStore();
      }, expiresAt.getTime() - new Date().getTime());

      set({ authUser });
    },
  })
);
const initialState = useAuthStore.getState();
export const resetAuthStore = () => {
  // localStorage.removeItem("user");
  nookies.destroy(null, "user");
  useAuthStore.setState(initialState, true);
};

export default useAuthStore;
