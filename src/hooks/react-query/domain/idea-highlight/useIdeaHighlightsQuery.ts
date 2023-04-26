import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useIdeaHighlightsQuery = () => {
  const query = useQuery(queryKeys.ideaHighlights, async () =>
    myAxios
      .get<IdeaHighlightDto[]>(urls.api.ideaHighlights)
      .then((res) => res.data)
  )
  return query
}

export default useIdeaHighlightsQuery
