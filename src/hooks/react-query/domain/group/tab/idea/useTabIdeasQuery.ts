import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import TabDto from "@/types/domain/group/tab/TabDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery, useQueryClient } from "react-query";

const useTabIdeasQuery = (tabId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery(queryKeys.tabIdeas(tabId), async () => {
    const tab = await myAxios
      .get<TabDto>(urls.api.tabId(tabId))
      .then((res) => res.data);
    if (!tab) return [];

    const groupIdeas = queryClient.getQueryData<IdeaDto[]>(
      queryKeys.groupIdeas(tab.groupId)
    );

    if (!groupIdeas) return [];

    return groupIdeas.filter((i) => i.tabId === tab.id);
  });
  return query;
};

export default useTabIdeasQuery;
