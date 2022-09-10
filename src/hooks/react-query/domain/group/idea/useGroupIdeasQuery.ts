import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useGroupIdeasQuery = (groupId: string) => {
  const query = useQuery(queryKeys.groupIdeas(groupId), async () => {
    if (!groupId) return [];

    return myAxios
      .get<IdeaDto[]>(urls.api.groupIdeas(groupId))
      .then((res) => res.data);
  });
  return query;
};

export default useGroupIdeasQuery;
