import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useTabIdeasQuery = (tabId: string) => {
  const query = useQuery(queryKeys.tabIdeas(tabId), () =>
    myAxios.get<IdeaDto[]>(urls.api.tabIdea(tabId)).then((res) => res.data)
  );
  return query;
};

export default useTabIdeasQuery;
