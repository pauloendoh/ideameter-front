import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

type LastRatingsInGroupDto = {
  createdAt: string
  updatedAt: string
  user: {
    id: string
    username: string
    profile: {
      pictureUrl: string
    }
  }
  targetIdea: {
    id: string
    tabId: string
    name: string
  }
  text: string
}

export const useLastCommentsInGroupQuery = (
  groupId: string,
  options?: {
    enabled: boolean
  }
) => {
  const axios = useAxios()
  return useQuery(
    urls.api.lastCommentsFromGroup(groupId),
    () =>
      axios
        .get<LastRatingsInGroupDto[]>(urls.api.lastCommentsFromGroup(groupId))
        .then((res) => res.data),
    {
      enabled: options?.enabled,
    }
  )
}
