import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { deleteFromArray, upsert } from "endoh-utils"
import { useMutation, useQueryClient } from "react-query"
import { IdeaHighlightDto } from "./types/IdeaHighlightDto"

const useToggleIdeaHighlightMutation = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const axios = useAxios()

  return useMutation(
    (ideaId: string) =>
      axios
        .post<IdeaHighlightDto | "deleted">(
          urls.api.toggleIdeaHighlight(ideaId)
        )
        .then((res) => res.data),
    {
      onSuccess: (data, ideaId) => {
        if (data === "deleted") {
          queryClient.setQueryData<IdeaHighlightDto[]>(
            queryKeys.ideaHighlights,
            (curr) => deleteFromArray(curr, (ih) => ih.ideaId === ideaId)
          )
          return
        }

        queryClient.setQueryData<IdeaHighlightDto[]>(
          queryKeys.ideaHighlights,
          (curr) => upsert(curr, data, (ih) => ih.ideaId === ideaId)
        )
      },
    }
  )
}

export default useToggleIdeaHighlightMutation
