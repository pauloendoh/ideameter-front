import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { useMutation } from "react-query"
import useHighlyRatedIdeasByMeQuery from "../idea/useHighlyRatedIdeasByMeQuery"

const useUpdateRatingPositionMutation = () => {
  const axios = useAxios()
  const { refetch } = useHighlyRatedIdeasByMeQuery()

  const { setSuccessMessage } = useSnackbarStore()

  return useMutation(
    (data: { ratingId: string; position: number | "first" | "last" | null }) =>
      axios
        .put(urls.api.moveRatingPosition(data.ratingId), {
          position: data.position,
        })
        .then((res) => res.data),
    {
      onSuccess: () => {
        refetch()

        setSuccessMessage("Rating position updated")
      },
    }
  )
}

export default useUpdateRatingPositionMutation
