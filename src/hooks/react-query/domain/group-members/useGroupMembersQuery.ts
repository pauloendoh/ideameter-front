import GroupMemberDto from "@/types/domain/group/GroupMemberDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useGroupMembersQuery = (groupId: string) => {
  const query = useQuery(queryKeys.groupMembers(groupId), () =>
    myAxios
      .get<GroupMemberDto[]>(urls.api.groupMembers(groupId))
      .then((res) => res.data)
  );
  return query;
};

export default useGroupMembersQuery;
