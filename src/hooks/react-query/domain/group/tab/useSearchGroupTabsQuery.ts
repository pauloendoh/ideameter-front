import GroupDto from "@/types/domain/group/GroupDto"
import TabDto from "@/types/domain/group/tab/TabDto"
import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

export type TabGroup = {
  tab: TabDto
  group: GroupDto
}

export const useSearchGroupTabsQuery = (query: string, minLength = 1) => {
  return useQuery(urls.api.searchGroupTabs(query), () => {
    if (query.length < minLength) {
      return []
    }
    const url = urls.api.searchGroupTabs(query)
    return myAxios.get<TabGroup[]>(url).then((res) => res.data)
  })
}
