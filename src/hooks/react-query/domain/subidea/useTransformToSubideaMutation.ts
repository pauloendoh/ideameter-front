import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import { IInitialValue } from "@/hooks/zustand/dialogs/useTransformToSubideadialogStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useRouter } from "next/router"
import { useMutation, useQueryClient } from "react-query"

const useTransformToSubideaMutation = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage } = useSnackbarStore()

  const axios = useAxios()
  const { groupId } = useRouterQueryString()
  const { push } = useRouter()

  return useMutation(
    (value: IInitialValue) =>
      axios
        .post<IdeaDto>(
          urls.api.transformToSubidea(value.ideaId, value.newParentIdeaTitle)
        )
        .then((res) => res.data),
    {
      onSuccess: (parentIdea) => {
        debugger
        setSuccessMessage("Transformed to subidea!")

        if (groupId && parentIdea.tabId) {
          queryClient.invalidateQueries(queryKeys.groupIdeas(groupId))
          queryClient.invalidateQueries(queryKeys.subideas(groupId))

          push(
            urls.pages.groupTabIdea(groupId, parentIdea.tabId, parentIdea.id)
          )
        }
      },
    }
  )
}

export default useTransformToSubideaMutation
