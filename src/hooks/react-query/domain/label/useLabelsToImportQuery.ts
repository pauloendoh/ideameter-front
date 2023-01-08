import LabelDto from "@/types/domain/label/LabelDto"
import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useLabelsToImportQuery = (groupId?: string) => {
  const query = useQuery(
    urls.api.labelsToImport(groupId!),
    () =>
      myAxios.get<LabelDto[]>(urls.api.labelsToImport(groupId!)).then((res) => res.data),
    {
      enabled: !!groupId,
    }
  )
  return query
}

export default useLabelsToImportQuery
