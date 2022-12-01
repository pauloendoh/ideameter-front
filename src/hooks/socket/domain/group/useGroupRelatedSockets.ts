import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import upsert from "@/utils/array/upsert"
import queryKeys from "@/utils/queryKeys"
import { socketEvents } from "@/utils/socketEvents"
import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { useMySocketEvent } from "../../useMySocketEvent"
import { useDeletedRatingSocket } from "./useDeletedRatingSocket/useDeletedRatingSocket"
import { useSavedRatingSocket } from "./useSaveRatingSocket/useSavedRatingSocket"

// PE 1/3
export const useGroupRelatedSockets = (groupId: string | undefined) => {
  const { sendMessage: sendEnterGroupMessage, socket } = useMySocketEvent<string>(
    "enter-group"
  )

  useEffect(() => {
    if (groupId && socket.connected) sendEnterGroupMessage(groupId)
  }, [groupId, socket.connected])

  const { lastMessage: lastMessageSaveIdea } = useMySocketEvent<{
    idea: IdeaDto
    groupId: string
  }>("saveIdea")
  const queryClient = useQueryClient()
  useEffect(() => {
    if (lastMessageSaveIdea && groupId) {
      queryClient.setQueryData<IdeaDto[]>(queryKeys.groupIdeas(groupId), (curr) =>
        upsert(
          curr,
          lastMessageSaveIdea.idea,
          (i) => i.id === lastMessageSaveIdea.idea.id
        )
      )
    }
  }, [lastMessageSaveIdea])

  const { lastMessage: lastMessageDeleteIdea } = useMySocketEvent<{
    idea: IdeaDto
    groupId: string
  }>(socketEvents.deleteIdea)

  useEffect(() => {
    if (lastMessageDeleteIdea?.groupId) {
      queryClient.setQueryData<IdeaDto[]>(
        queryKeys.groupIdeas(lastMessageDeleteIdea.groupId),
        (curr) => pushOrRemove(curr || [], lastMessageDeleteIdea.idea, "id")
      )
    }
  }, [lastMessageDeleteIdea])

  const { lastMessage: lastMessageMoveIdeasToTab } = useMySocketEvent<IdeaDto[]>(
    socketEvents.moveIdeasToTab
  )
  useEffect(() => {
    if (!lastMessageMoveIdeasToTab) return

    for (const idea of lastMessageMoveIdeasToTab) {
      queryClient.setQueryData<IdeaDto[]>(queryKeys.groupIdeas(groupId!), (curr) => {
        if (!curr) return [idea]
        return upsert(curr, idea, (i) => i.id === idea.id)
      })
    }
  }, [lastMessageMoveIdeasToTab])

  useSavedRatingSocket()
  useDeletedRatingSocket()
}
