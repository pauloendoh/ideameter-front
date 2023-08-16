import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useHighImpactVotedByMeQuery = () => {
  const axios = useAxios()
  const query = useQuery(queryKeys.highImpactVotedByMe, async () =>
    axios
      .get<AssignedToMeDto[]>(urls.api.highImpactVotedByMe)
      .then((res) => res.data)
  )
  return query
}

export default useHighImpactVotedByMeQuery
