import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useSubideasQuery = (parentId: string) => {
  const query = useQuery(queryKeys.subideas(parentId), () =>
    myAxios.get<IdeaDto[]>(urls.api.subideas(parentId)).then((res) => res.data)
  );
  return query;
};

export default useSubideasQuery;
