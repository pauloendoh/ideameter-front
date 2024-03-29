import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useAssignedToMeQuery = () => {
  const axios = useAxios()
  const query = useQuery(queryKeys.assignedToMeIdeas, async () =>
    axios
      .get<AssignedToMeDto[]>(urls.api.ideasAssignedToMe)
      .then((res) => res.data)
  )
  return query
}

export default useAssignedToMeQuery
