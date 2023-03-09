import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"
import { CommentDto } from "./types/CommentDto"

const useIdeaCommentsQuery = (ideaId: string) => {
  const axios = useAxios()
  return useQuery(
    queryKeys.ideaComments(ideaId),
    () =>
      axios
        .get<CommentDto[]>(urls.api.ideaComments(ideaId))
        .then((res) => res.data),
    {
      enabled: !!ideaId,
    }
  )
}

export default useIdeaCommentsQuery
