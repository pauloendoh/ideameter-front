import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { upsert } from "endoh-utils"
import { useMutation, useQueryClient } from "react-query"
import { GhostRatingDto } from "./types/GhostRatingDto"

export const useSaveGhostRatingMutation = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage } = useSnackbarStore()

  const axios = useAxios()

  return useMutation(
    (input: { ideaId: string; groupId: string; rating: number | null }) =>
      axios
        .post<GhostRatingDto>(
          urls.api.saveMyGhostRating({ ideaId: input.ideaId }),
          {
            rating: input.rating,
          }
        )
        .then((res) => res.data),
    {
      onSuccess: (saved, input) => {
        queryClient.cancelQueries(urls.api.getMyGhostRatings(input.groupId))

        queryClient.setQueryData<GhostRatingDto[]>(
          urls.api.getMyGhostRatings(input.groupId),
          (curr) => {
            return upsert(curr, saved, (item) => item.id === saved.id)
          }
        )

        setSuccessMessage("Ghost rating saved!")
      },
    }
  )
}
