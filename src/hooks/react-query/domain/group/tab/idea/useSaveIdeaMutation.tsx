import { useScrollToIdea } from "@/hooks/domain/idea/useScrollToIdea"
import { useMySocketEvent } from "@/hooks/socket/useMySocketEvent"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import upsert from "@/utils/array/upsert"
import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import Link from "@mui/material/Link"
import { useMutation, useQueryClient } from "react-query"

const useSaveIdeaMutation = () => {
  const { groupId } = useRouterQueryString()

  const { sendMessage } = useMySocketEvent("saveIdea")

  const scrollToIdea = useScrollToIdea()
  const queryClient = useQueryClient()
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const axios = useAxios()

  const { openDialog } = useIdeaDialogStore()

  return useMutation(
    (payload: IdeaDto) =>
      axios
        .request<IdeaDto>({
          url: urls.api.tabIdea(payload.tabId as string),
          data: payload,
          method: payload.id ? "PUT" : "POST",
        })
        .then((res) => res.data),
    {
      onSuccess: (savedIdea, payload) => {
        if (groupId) {
          queryClient.setQueryData<IdeaDto[]>(
            queryKeys.groupIdeas(groupId),
            (curr) => {
              return upsert(curr, savedIdea, (i) => i.id === savedIdea.id)
            }
          )
        }

        if (groupId && payload.parentId) {
          queryClient.invalidateQueries(queryKeys.subideas(groupId))
        }

        queryClient.invalidateQueries(queryKeys.tabIdeas(savedIdea.tabId!))

        if (payload.id === "" && groupId) {
          queryClient.invalidateQueries(queryKeys.ratingsByGroup(groupId))
        }

        setSuccessMessage(
          <>
            Idea saved!{" "}
            <Link
              sx={(theme) => ({
                cursor: "pointer",
                color: theme.palette.text.primary,
              })}
              onClick={() => openDialog(savedIdea)}
            >
              Open
            </Link>
          </>
        )

        queryClient.invalidateQueries(queryKeys.ideaChanges(savedIdea.id))

        sendMessage({ idea: savedIdea, groupId })
        scrollToIdea(savedIdea.id)
      },
    }
  )
}

export default useSaveIdeaMutation
