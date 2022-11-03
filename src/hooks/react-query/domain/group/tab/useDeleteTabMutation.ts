import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import TabDto from "@/types/domain/group/tab/TabDto"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useRouter } from "next/router"
import { useMutation, useQueryClient } from "react-query"

const useDeleteTabMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const { groupId, tabId } = useRouterQueryString()

  return useMutation(
    (payload: TabDto) =>
      myAxios
        .delete<TabDto>(urls.api.groupTab(payload.groupId), {
          data: payload,
        })
        .then((res) => res.data),
    {
      onSuccess: (deletedTab) => {
        setSuccessMessage("Tab deleted!")

        const groupTabs = queryClient.getQueryData<TabDto[]>(
          queryKeys.groupTabs(deletedTab.groupId)
        )

        if (!groupTabs) return

        const newGroupTabs = pushOrRemove(groupTabs, deletedTab, "id")

        queryClient.setQueryData(queryKeys.groupTabs(deletedTab.groupId), newGroupTabs)

        if (!groupId || tabId !== deletedTab.id) {
          return
        }

        const nextAvailableTab = groupTabs.find((t) => t.id !== tabId)
        if (nextAvailableTab) {
          router.push(urls.pages.groupTab(groupId, nextAvailableTab.id))
          return
        }

        queryClient.invalidateQueries(queryKeys.groupIdeas(groupId))
        queryClient.invalidateQueries(queryKeys.groupTabs(groupId))
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err))
      },
    }
  )
}

export default useDeleteTabMutation
