import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import router from "next/router"

export const useCheckAndRedirectLastOpenedGroup = () => {
  const axios = useAxios()
  const checkAndRedirectLastOpenedGroup = () => {
    axios.get<string>(urls.api.lastOpenedGroupId).then((res) => {
      if (res.data) router.push(urls.pages.groupId(res.data))
    })
  }

  return checkAndRedirectLastOpenedGroup
}
