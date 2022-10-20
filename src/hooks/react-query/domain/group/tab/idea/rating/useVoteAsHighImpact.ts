import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import myAxios from "@/utils/axios/myAxios"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"
import queryKeys from "@/utils/queryKeys"
import upsert from "@/utils/array/upsert"
import { useMySocketEvent } from "@/hooks/socket/useMySocketEvent"
import { useScrollToIdea } from "@/hooks/domain/idea/useScrollToIdea"
import { AxiosError } from "axios"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"

type VAsHighImpactType = Pick<IdeaDto, "id" | "parentId" | "highImpactVotes" | "tabId">

const useVoteAsHighImpact = () => {
  const { sendMessage } = useMySocketEvent("saveIdea")

  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()
  const scrollToIdea = useScrollToIdea()
  const queryClient = useQueryClient()
  const { groupId } = useRouterQueryString()
  return useMutation(
    async ({ highImpactVotes, tabId }: VAsHighImpactType) => {
      const request = await myAxios.request<IdeaDto>({
        url: urls.api.tabIdea(tabId as string),
        data: highImpactVotes,
        method: "PACTH",
      })

      return request.data
    },
    {
      onSuccess: (savedIdea, payload) => {
        if (groupId) {
          queryClient.setQueryData<IdeaDto[]>(queryKeys.groupIdeas(groupId), (curr) => {
            return upsert(curr, savedIdea, (i) => i.id === savedIdea.id)
          })
        }

        if (groupId && payload.parentId)
          queryClient.invalidateQueries(queryKeys.subideas(groupId))

        queryClient.invalidateQueries(queryKeys.tabIdeas(savedIdea.tabId!))

        if (payload.id === "" && groupId)
          queryClient.invalidateQueries(queryKeys.ratingsByGroup(groupId))

        setSuccessMessage("Idea saved!")

        sendMessage({ idea: savedIdea, groupId })
        scrollToIdea(savedIdea.id)
      },
      onError: (err: AxiosError<any>) => {
        setErrorMessage(err?.response?.data?.message || "Error saving idea")
      },
    }
  )
}

export default useVoteAsHighImpact
