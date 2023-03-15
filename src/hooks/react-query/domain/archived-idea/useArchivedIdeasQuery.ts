import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { useQuery } from "react-query"
import { useAxios } from "../../../../utils/axios/useAxios"
import queryKeys from "../../../../utils/queryKeys"
import urls from "../../../../utils/urls"

const useArchivedIdeasQuery = (groupId: string) => {
  const axios = useAxios()
  return useQuery(
    queryKeys.ideaComments(groupId),
    () =>
      axios
        .get<IdeaDto[]>(urls.api.archivedIdeas(groupId))
        .then((res) => res.data),
    {
      enabled: !!groupId,
    }
  )
}

export default useArchivedIdeasQuery
