import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useGroupIdeasQuery = (groupId: string) => {
  const query = useQuery(
    queryKeys.groupIdeas(groupId),
    () =>
      myAxios
        .get<IdeaDto[]>(urls.api.groupIdeas(groupId))
        .then((res) => res.data),
    {
      initialData: [],
      refetchOnWindowFocus: false,
    }
  );
  return query;
};

export default useGroupIdeasQuery;
