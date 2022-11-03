import TabDto from "@/types/domain/group/tab/TabDto"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useGroupTabsQuery = (groupId: string) => {
  const query = useQuery(queryKeys.groupTabs(groupId), () =>
    myAxios.get<TabDto[]>(urls.api.groupTab(groupId)).then((res) => res.data)
  )
  return query
}

export default useGroupTabsQuery
