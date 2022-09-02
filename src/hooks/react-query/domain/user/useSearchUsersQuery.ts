import SimpleUserDto from "@/types/domain/user/SimpleUserDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useSearchUsersQuery = (query: string, minLength = 1) => {
  return useQuery(
    queryKeys.userSearchResults,
    async () => {
      if (query.length < minLength) {
        return new Promise<SimpleUserDto[]>((resolve) => {
          resolve([]);
        });
      }
      return myAxios
        .get<SimpleUserDto[]>(urls.api.userSearch(query))
        .then((res) => res.data);
    },

    {}
  );
};

export default useSearchUsersQuery;
