import { useMySocketEvent } from "@/hooks/socket/useMySocketEvent"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import deleteFromArray from "@/utils/array/deleteFromArray"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import { socketEvents } from "@/utils/socketEvents"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"

interface Variables {
  idea: IdeaDto
}

const useDeleteIdeaMutation = () => {
  const queryClient = useQueryClient()
  const { groupId } = useRouterQueryString()
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const { sendMessage } = useMySocketEvent(socketEvents.deleteIdea)

  return useMutation(
    ({ idea }: Variables) =>
      myAxios.delete(urls.api.ideaId(idea.id)).then((res) => res.data),
    {
      onSuccess: (_, { idea }) => {
        setSuccessMessage("Idea deleted!")

        if (groupId) {
          queryClient.setQueryData<IdeaDto[]>(queryKeys.groupIdeas(groupId), (curr) => {
            return deleteFromArray(curr, (i) => i.id === idea.id)
          })

          sendMessage({ idea, groupId })
        }
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err))
      },
    }
  )
}

export default useDeleteIdeaMutation
