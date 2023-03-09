import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { upsert } from "endoh-utils"
import { useMutation, useQueryClient } from "react-query"
import { CommentDto } from "./types/CommentDto"

const useSaveCommentMutation = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const axios = useAxios()
  return useMutation(
    (params: { ideaId: string; dto: CommentDto }) =>
      axios
        .post<CommentDto>(urls.api.comments, params.dto)
        .then((res) => res.data),
    {
      onSuccess: (saved, params) => {
        queryClient.setQueryData<CommentDto[]>(
          queryKeys.ideaComments(params.ideaId),
          (curr) => upsert(curr, saved, (a) => a.id === saved.id)
        )

        setSuccessMessage("Comment saved!")
      },
    }
  )
}

export default useSaveCommentMutation
