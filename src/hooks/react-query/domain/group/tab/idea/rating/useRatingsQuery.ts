import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useQuery } from "react-query";

const useRatingsQuery = (groupId: string, parentIdeaId?: string) => {
  if (parentIdeaId)
    return useQuery(queryKeys.subideaRatings(parentIdeaId), () =>
      myAxios
        .get<RatingDto[]>(urls.api.subideaRatings(parentIdeaId))
        .then((res) => res.data)
    );

  return useQuery(queryKeys.ratingsByGroup(groupId), () =>
    myAxios
      .get<RatingDto[]>(urls.api.groupRatings(groupId))
      .then((res) => res.data)
  );
};

export default useRatingsQuery;
