import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"

const useRefreshRatingMutation = () => {
  const { setSuccessMessage } = useSnackbarStore()

  const queryClient = useQueryClient()

  const axios = useAxios()

  return useMutation(
    (ratingId: string) =>
      axios
        .put<RatingDto>(urls.api.refreshRating(ratingId))
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(urls.api.highlyRatedIdeasByMe)

        setSuccessMessage("Rating updated!")
      },
    }
  )
}

export default useRefreshRatingMutation
