import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

interface UserLastOnlineDto {
  userId: string
  lastOnlineAt: string
}

const useGroupMembersLastOnlineQuery = (groupId?: string, userId?: string) => {
  const query = useQuery(
    queryKeys.groupMembersLastOnline(groupId, userId),
    async () => {
      if (!groupId || !userId) return []

      return myAxios
        .get<UserLastOnlineDto[]>(
          urls.api.groupMembersLastOnline(groupId, userId!)
        )
        .then((res) => res.data)
    },
    {
      refetchInterval: 15 * 1000,
      enabled: !!groupId && !!userId,
    }
  )
  return query
}

export default useGroupMembersLastOnlineQuery
