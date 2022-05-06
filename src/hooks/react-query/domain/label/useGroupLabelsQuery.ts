import LabelDto from "@/types/domain/label/LabelDto";
import myAxios from "@/utils/axios/myAxios";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useGroupLabelsQuery = (groupId: string) => {
  const query = useQuery(urls.api.groupLabels(groupId), () =>
    myAxios
      .get<LabelDto[]>(urls.api.groupLabels(groupId))
      .then((res) => res.data)
  );
  return query;
};

export default useGroupLabelsQuery;
