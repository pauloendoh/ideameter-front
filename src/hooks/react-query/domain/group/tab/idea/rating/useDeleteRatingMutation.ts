import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"

const useDeleteRatingMutation = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  return useMutation(
    ({ ideaId }: { ideaId: string; groupId: string }) =>
      myAxios
        .delete<RatingDto>(urls.api.ideaRating(ideaId))
        .then((res) => res.data),
    {
      onSuccess: (savedRating, { groupId }) => {
        const groupRatings = queryClient.getQueryData<RatingDto[]>(
          queryKeys.ratingsByGroup(groupId)
        )

        if (!groupRatings) return

        debugger
        const newGroupRatings = pushOrRemove(groupRatings, savedRating, "id")

        queryClient.setQueryData(
          queryKeys.ratingsByGroup(groupId),
          newGroupRatings
        )
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err))
      },
    }
  )
}

export default useDeleteRatingMutation
