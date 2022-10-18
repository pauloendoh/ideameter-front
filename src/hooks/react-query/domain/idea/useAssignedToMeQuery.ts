import GroupDto from "@/types/domain/group/GroupDto"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"
import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"

const useAssignedToMeQuery = () => {
  const query = useQuery(queryKeys.assignedToMeIdeas, async () =>
    myAxios.get<AssignedToMeDto[]>(urls.api.ideasAssignedToMe).then((res) => res.data)
  )
  return query
}

export default useAssignedToMeQuery
