import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useIdeaChangesQuery = (ideaId: string) => {
  const axios = useAxios()
  return useQuery(
    queryKeys.subideas(ideaId),
    () =>
      axios
        .get<IdeaChangeDto[]>(urls.api.ideaChanges(ideaId))
        .then((res) => res.data),
    {
      enabled: !!ideaId,
    }
  )
}

export default useIdeaChangesQuery

export interface IdeaChangeDto {
  id: string
  ideaId: string
  userId: string
  changeType: IdeaChangeType
  prevText: string
  newText: string
  createdAt: string
}

export type IdeaChangeType = "Description" | "Title"
