import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useSubideasQuery = (groupId: string) => {
  const axios = useAxios()
  return useQuery(
    queryKeys.subideas(groupId),
    () =>
      axios.get<IdeaDto[]>(urls.api.subideas(groupId)).then((res) => res.data),
    {
      enabled: !!groupId,
    }
  )
}

export default useSubideasQuery
