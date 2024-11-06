import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

type GroupMembersLastRatingsDto = {
  userId: string
  ratings: {
    updatedAt: string
    idea: {
      id: string
      name: string
    }
    rating: number
  }[]
}

export const useGroupMembersLastRatingsQuery = (
  groupId: string,
  options?: {
    enabled: boolean
  }
) => {
  const axios = useAxios()
  return useQuery(
    queryKeys.groupMembersLastRatings(groupId),
    () =>
      axios
        .get<GroupMembersLastRatingsDto[]>(
          urls.api.groupMembersLastRatings(groupId)
        )
        .then((res) => res.data),
    {
      enabled: options?.enabled,
    }
  )
}
