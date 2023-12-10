import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useUserSettingsQuery = () => {
  const axios = useAxios()
  return useQuery([urls.api.userSettings], () =>
    axios.get<UserSettingsDto>(urls.api.userSettings).then((res) => res.data)
  )
}

export default useUserSettingsQuery

export interface UserSettingsDto {
  hiddenTabsIds: string[]
}

export type IdeaChangeType = "Description" | "Title"
