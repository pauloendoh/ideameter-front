import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useGroupRatingsQuery = (groupId: string) => {
  const query = useQuery(queryKeys.ratingsByGroup(groupId), () =>
    myAxios
      .get<RatingDto[]>(urls.api.groupRatings(groupId))
      .then((res) => res.data)
  );
  return query;
};

export default useGroupRatingsQuery;
