import GroupDto from "@/types/domain/group/GroupDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useGroupsQuery = () => {
  const query = useQuery(queryKeys.groups, () =>
    myAxios.get<GroupDto[]>(urls.api.group).then((res) => res.data)
  );
  return query;
};

export default useGroupsQuery;
