import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useHighlyRatedIdeasByMeQuery = () => {
  const axios = useAxios()
  const query = useQuery([urls.api.highlyRatedIdeasByMe], async () =>
    axios
      .get<AssignedToMeDto[]>(urls.api.highlyRatedIdeasByMe)
      .then((res) => res.data)
  )
  return query
}

export default useHighlyRatedIdeasByMeQuery
