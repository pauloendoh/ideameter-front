import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import LabelDto from "@/types/domain/label/LabelDto"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"
import { ImportLabelPostDto } from "../../../../types/domain/label/ImportLabelPostDto"
const useImportLabelsMutation = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage } = useSnackbarStore()

  const axios = useAxios()

  return useMutation(
    (params: { groupId: string; labels: ImportLabelPostDto[] }) =>
      axios
        .post<LabelDto[]>(urls.api.importLabels(params.groupId), params.labels)
        .then((res) => res.data),
    {
      onSuccess: (returned, params) => {
        setSuccessMessage("Imported!")

        queryClient.setQueryData<LabelDto[]>(
          urls.api.groupLabels(params.groupId),
          (curr) => [...(curr || []), ...returned]
        )
      },
    }
  )
}

export default useImportLabelsMutation
