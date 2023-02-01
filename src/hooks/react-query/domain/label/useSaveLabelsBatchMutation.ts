import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import LabelDto from "@/types/domain/label/LabelDto"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"

const useSaveLabelsBatchMutation = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const axios = useAxios()

  return useMutation(
    (payload: LabelDto[]) =>
      axios.put<LabelDto[]>(urls.api.labels, payload).then((res) => res.data),
    {
      onSuccess: (saved) => {
        const groupId = saved[0].groupId
        queryClient.setQueryData(urls.api.groupLabels(groupId), saved)

        setSuccessMessage("Labels saved!")
      },
    }
  )
}

export default useSaveLabelsBatchMutation
