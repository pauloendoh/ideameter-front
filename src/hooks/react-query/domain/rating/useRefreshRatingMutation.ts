import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
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
      onSuccess: (rating) => {
        queryClient.setQueryData<AssignedToMeDto[]>(
          urls.api.highlyRatedIdeasByMe,
          (curr) => {
            if (!curr) return []
            const item = curr.find((item) => item.idea.id === rating.ideaId)

            if (item?.myRating) {
              item.myRating = rating
            }

            return curr
          }
        )

        setSuccessMessage("Rating updated!")
      },
    }
  )
}

export default useRefreshRatingMutation
