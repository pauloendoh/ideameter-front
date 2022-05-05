import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import AuthUserGetDto from "@/types/domain/auth/AuthUserGetDto";
import myAxios from "@/utils/axios/myAxios";
import urls from "@/utils/urls";
import { useRouter } from "next/router";
import nookies from "nookies";
import { useState } from "react";
import { useLogoutAndPushIndex } from "./useLogout";

const useCheckAuthOrLogout = () => {
  const logout = useLogoutAndPushIndex();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const routerQuery = router.query as {
    oauthToken?: string;
    userId?: string;
  };

  const { setAuthUser } = useAuthStore();
  const { setErrorMessage } = useSnackbarStore();

  const checkAuthOrLogout = () => {
    const userCookieStr = nookies.get(null).user;
    // const googleSession = getCookie('endoh_google_session')

    if (!userCookieStr) {
      // if (routerQuery?.oauthToken?.length && routerQuery?.userId?.length) {
      //   myAxios
      //     .post<AuthUserGetDto>(urls.auth.googleLogin, {
      //       // withCredentials: true
      //       userId: Number(userId),
      //       token: oauthToken,
      //     })
      //     .then((res) => {
      //       const user = res.data;
      //       localStorage.setItem("user", JSON.stringify(user));
      //       setAuthUser(user);
      //     });
      // }

      return setLoading(false);
    } else {
      // Regular login
      const user: AuthUserGetDto = JSON.parse(userCookieStr);
      if (new Date(user.expiresAt) <= new Date()) {
        logout();
        return setLoading(false);
      }

      myAxios
        .get<AuthUserGetDto>(urls.api.me)
        .then((res) => {
          setAuthUser(res.data);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    }
  };

  return { checkAuthOrLogout, loading };
};

export default useCheckAuthOrLogout;
