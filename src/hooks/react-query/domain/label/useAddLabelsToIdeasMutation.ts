import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { pushOrReplaceMany } from "endoh-utils"
import { useMutation, useQueryClient } from "react-query"

export const useAddLabelsToIdeasMutation = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage } = useSnackbarStore()

  const axios = useAxios()

  return useMutation(
    (input: { groupId: string; ideaIds: string[]; labelIds: string[] }) =>
      axios
        .post<IdeaDto[]>(urls.api.labelsToIdeas, input)
        .then((res) => res.data),
    {
      onSuccess: (savedIdeas, input) => {
        queryClient.setQueryData<IdeaDto[]>(
          queryKeys.groupIdeas(input.groupId),
          (curr) => {
            return pushOrReplaceMany(
              curr,
              savedIdeas,
              (newIdea, oldIdea) => newIdea.id === oldIdea.id
            )
          }
        )
        setSuccessMessage("Labels added!")
      },
    }
  )
}
