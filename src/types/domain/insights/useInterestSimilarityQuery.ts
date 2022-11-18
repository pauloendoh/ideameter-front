import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"
import { InterestSimilarityDto } from "./InterestSimilarityDto"

const useInterestSimilarityQuery = (groupId: string) => {
  const axios = useAxios()
  const query = useQuery(queryKeys.interestSimilarity(groupId), () =>
    axios
      .get<InterestSimilarityDto[]>(urls.api.interestSimilarity(groupId))
      .then((res) => res.data)
  )
  return query
}

export default useInterestSimilarityQuery
