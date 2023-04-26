import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useHighlightableIdeasQuery = () => {
  const query = useQuery(queryKeys.highlightableIdeas, async () =>
    myAxios.get<IdeaDto[]>(urls.api.highlightableIdeas).then((res) => res.data)
  )
  return query
}

export default useHighlightableIdeasQuery
