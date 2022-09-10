import queryKeys from "@/utils/queryKeys";
import { useQuery } from "react-query";
import useGroupIdeasQuery from "../../idea/useGroupIdeasQuery";

interface Params {
  tabId: string;
  groupId: string;
}

const useTabIdeasQuery = ({ tabId, groupId }: Params) => {
  const { data: groupIdeas } = useGroupIdeasQuery(groupId);

  const query = useQuery(queryKeys.tabIdeas(tabId), async () => {
    if (!groupIdeas) return [];

    return groupIdeas.filter((i) => i.tabId === tabId);
  });
  return query;
};

export default useTabIdeasQuery;
