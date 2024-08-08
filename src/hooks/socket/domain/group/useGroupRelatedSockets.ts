import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import upsert from "@/utils/array/upsert"
import queryKeys from "@/utils/queryKeys"
import { socketEvents } from "@/utils/socketEvents"
import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { useMySocketEvent } from "../../useMySocketEvent"
import { useDeletedRatingWSListener } from "./useDeletedRatingWSListener/useDeletedRatingWSListener"
import { useMovedIdeasWSListener } from "./useMovedIdeasWSListener/useMovedIdeasWSListener"
import { useSavedRatingWSListener } from "./useSavedRatingWSListener/useSavedRatingWSListener"

export const useGroupRelatedSockets = (groupId: string | undefined) => {
  useMovedIdeasWSListener(groupId!)
  useSavedRatingWSListener()
  useDeletedRatingWSListener()

  // PE 1/3 - seguir o padrão de WSListener e WSPublisher hooks
  const { sendMessage: submitEnterGroup, socket } =
    useMySocketEvent<string>("enter-group")

  useEffect(() => {
    if (groupId && socket.connected) {
      submitEnterGroup(groupId)
    }
  }, [groupId, socket.connected])

  const { lastMessage: lastSavedIdea } = useMySocketEvent<{
    idea: IdeaDto
    groupId: string
  }>("saveIdea")

  const queryClient = useQueryClient()
  useEffect(() => {
    if (lastSavedIdea && groupId) {
      queryClient.setQueryData<IdeaDto[]>(
        queryKeys.groupIdeas(groupId),
        (curr) =>
          upsert(
            curr,
            lastSavedIdea.idea,
            (i) => i.id === lastSavedIdea.idea.id
          )
      )
    }
  }, [lastSavedIdea])

  const { lastMessage: lastDeletedIdea } = useMySocketEvent<{
    idea: IdeaDto
    groupId: string
  }>(socketEvents.deleteIdea)

  useEffect(() => {
    if (lastDeletedIdea?.groupId) {
      queryClient.setQueryData<IdeaDto[]>(
        queryKeys.groupIdeas(lastDeletedIdea.groupId),
        (curr) => pushOrRemove(curr || [], lastDeletedIdea.idea, "id")
      )
    }
  }, [lastDeletedIdea])
}
