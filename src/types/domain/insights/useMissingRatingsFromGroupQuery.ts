import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"
import { MissingRatingDto } from "./MissingRatingDto"

const useMissingRatingsFromGroupQuery = (groupId: string) => {
  const axios = useAxios(false)
  const query = useQuery(queryKeys.missingRatingsFromGroup(groupId), () =>
    axios
      .get<MissingRatingDto[]>(urls.api.missingRatingsFromGroup(groupId))
      .then((res) => res.data)
  )
  return query
}

export default useMissingRatingsFromGroupQuery
