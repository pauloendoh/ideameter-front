import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { MoveIdeasToTabDto } from "@/types/domain/idea/MoveIdeasToTabDto"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"

const useMoveIdeasToTabMutation = () => {
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const { groupId } = useRouterQueryString()
  const queryClient = useQueryClient()

  return useMutation(
    (dto: MoveIdeasToTabDto) =>
      myAxios.put<IdeaDto[]>(urls.api.moveIdeasToTab, dto).then((res) => res.data),
    {
      onSuccess: (ideas, payload) => {
        queryClient.invalidateQueries(queryKeys.groupIdeas(groupId!))

        setSuccessMessage("Ideas moved to tab!")
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err))
      },
    }
  )
}

export default useMoveIdeasToTabMutation
