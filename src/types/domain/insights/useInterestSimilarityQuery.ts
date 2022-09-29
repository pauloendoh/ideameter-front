import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"
import { InterestSimilarityDto } from "./InterestSimilarityDto"

const useInterestSimilarityQuery = (groupId: string) => {
  const query = useQuery(queryKeys.interestSimilarity(groupId), () =>
    myAxios
      .get<InterestSimilarityDto[]>(urls.api.interestSimilarity(groupId))
      .then((res) => res.data)
  )
  return query
}

export default useInterestSimilarityQuery
