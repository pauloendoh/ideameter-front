import GroupDto from "@/types/domain/group/GroupDto"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useAssignedToMeQuery = (userId: string) => {
  const query = useQuery(queryKeys.assignedToMeIdeas, async () =>
    myAxios.get(urls.api.ideasAssignedToMe).then((res) => res.data)
  )
  return query
}

export default useAssignedToMeQuery
