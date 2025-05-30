import { cookieKeys } from "@/utils/cookieKeys"
import nookies from "nookies"
import AuthUserGetDto from "types/domain/auth/AuthUserGetDto"
import create from "zustand"

interface IAuthStore {
  authUser: AuthUserGetDto | null
  setAuthUser: (authUser: AuthUserGetDto) => void

  authUserId: string
  getAuthUserId: () => string
}

const useAuthStore = create<IAuthStore>((set, get) => ({
  authUser: null,
  authUserId: "",
  setAuthUser: (authUser) => {
    const expiresAt = new Date(authUser.expiresAt)

    nookies.set(null, cookieKeys.user, JSON.stringify(authUser), {
      secure: true,

      path: "/",
      maxAge: 365 * 24 * 60 * 60, // 1 year
    })
    // localStorage.setItem("user", JSON.stringify(authUser));

    // Refresh logout timeout
    setTimeout(() => {
      return resetAuthStore()
    }, expiresAt.getTime() - new Date().getTime())

    set({ authUser, authUserId: authUser.id })
  },
  getAuthUserId() {
    return get().authUser?.id ?? ""
  },
}))
const initialState = useAuthStore.getState()
export const resetAuthStore = () => {
  nookies.destroy(null, cookieKeys.user)
  useAuthStore.setState(initialState, true)
}

export default useAuthStore
