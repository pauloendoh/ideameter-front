import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { upsert } from "endoh-utils"
import { useMutation, useQueryClient } from "react-query"
import { CanRateForMeDto } from "./types/CanRateForMeDto"

export const useSaveCanRateForMe = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage } = useSnackbarStore()

  const axios = useAxios()

  return useMutation(
    (input: { groupId: string; canRate: boolean; allowedMemberId: string }) =>
      axios
        .post<CanRateForMeDto>(urls.api.canRateForMe(input.groupId), {
          canRate: input.canRate,
          allowedMemberId: input.allowedMemberId,
        })
        .then((res) => res.data),
    {
      onSuccess: (saved, input) => {
        queryClient.cancelQueries(urls.api.canRateForMe(input.groupId))

        queryClient.setQueryData<CanRateForMeDto[]>(
          urls.api.canRateForMe(input.groupId),
          (curr) => {
            return upsert(curr, saved, (item) => item.id === saved.id)
          }
        )

        setSuccessMessage("Saved!")
      },
    }
  )
}
