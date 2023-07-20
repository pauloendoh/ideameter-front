import urls from "@/utils/urls"
import { useRouter } from "next/router"
import { resetAuthStore } from "../../zustand/domain/auth/useAuthStore"

export const useLogoutAndPushIndex = () => {
  const router = useRouter()

  const logout = () => {
    resetAuthStore()
    router.push(
      urls.pages.index + `?redirectTo=${encodeURIComponent(router.asPath)}`
    )
  }
  return logout
}
