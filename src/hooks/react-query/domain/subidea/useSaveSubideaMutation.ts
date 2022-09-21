import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import upsert from "@/utils/array/upsert"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { AxiosError } from "axios"
import { useMutation, useQueryClient } from "react-query"

interface Variables {
  subidea: IdeaDto
  groupId: string
}

const useSaveSubideaMutation = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  return useMutation(
    ({ subidea }: Variables) =>
      myAxios
        .request<IdeaDto>({
          url: urls.api.subideas(subidea.parentId as string),
          data: subidea,
          method: subidea.id ? "PUT" : "POST",
        })
        .then((res) => res.data),
    {
      onSuccess: (saved, { groupId }) => {
        if (saved.parentId) {
          const currentData = queryClient.getQueryData<IdeaDto[]>(
            queryKeys.subideas(groupId)
          )

          const newSubideas = upsert(
            currentData,
            saved,
            (oldItem) => oldItem.id === saved.id
          )

          queryClient.setQueryData(queryKeys.subideas(groupId), newSubideas)
        }

        setSuccessMessage("Subidea saved!")
      },
      onError: (err: AxiosError<any>) => {
        setErrorMessage(err?.response?.data?.message || "Error saving subidea")
      },
    }
  )
}

export default useSaveSubideaMutation
