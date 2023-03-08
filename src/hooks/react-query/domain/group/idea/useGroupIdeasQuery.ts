import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useGroupIdeasQuery = (groupId: string) => {
  const axios = useAxios()
  const query = useQuery(
    queryKeys.groupIdeas(groupId),
    async () => {
      if (!groupId) return []

      return axios
        .get<IdeaDto[]>(urls.api.groupIdeas(groupId))
        .then((res) => res.data)
    },
    {
      refetchOnWindowFocus: false,
    }
  )
  return query
}

export default useGroupIdeasQuery
