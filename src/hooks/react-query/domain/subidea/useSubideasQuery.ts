import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useSubideasQuery = (groupId: string) => {
  return useQuery(queryKeys.subideas(groupId), () =>
    myAxios.get<IdeaDto[]>(urls.api.subideas(groupId)).then((res) => res.data)
  );
};

export default useSubideasQuery;
