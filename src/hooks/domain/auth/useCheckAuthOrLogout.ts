import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import AuthUserGetDto from "@/types/domain/auth/AuthUserGetDto"
import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import nookies from "nookies"
import { useState } from "react"
import { useLogoutAndPushIndex } from "./useLogoutAndPushIndex"

const useCheckAuthOrLogout = () => {
  const logoutAndPushIndex = useLogoutAndPushIndex()

  const [loading, setLoading] = useState(true)

  const { setAuthUser } = useAuthStore()

  const checkAuthOrLogout = () => {
    const userCookieStr = nookies.get(null).user

    if (!userCookieStr) {
      logoutAndPushIndex()
      return setLoading(false)
    }
    // Regular login
    const user: AuthUserGetDto = JSON.parse(userCookieStr)
    if (new Date(user.expiresAt) <= new Date()) {
      logoutAndPushIndex()
      return setLoading(false)
    }

    myAxios
      .get<AuthUserGetDto>(urls.api.me)
      .then((res) => {
        setAuthUser(res.data)
      })
      .catch(() => {
        logoutAndPushIndex()
      })
      .finally(() => setLoading(false))
  }

  return { checkAuthOrLogout, loading }
}

export default useCheckAuthOrLogout
