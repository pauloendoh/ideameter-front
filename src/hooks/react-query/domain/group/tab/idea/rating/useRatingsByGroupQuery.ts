import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useRatingsByGroupQuery = (groupId: string) => {
  const query = useQuery(queryKeys.ratingsByGroup(groupId), () =>
    myAxios
      .get<RatingDto[]>(urls.api.ratingsByGroup(groupId))
      .then((res) => res.data)
  );
  return query;
};

export default useRatingsByGroupQuery;
