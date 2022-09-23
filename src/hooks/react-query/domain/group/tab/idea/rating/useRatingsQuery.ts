import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useRatingsQuery = (groupId: string) => {
  return useQuery(queryKeys.ratingsByGroup(groupId), () =>
    myAxios
      .get<RatingDto[]>(urls.api.groupRatings(groupId))
      .then((res) => res.data)
  )
}

export default useRatingsQuery
