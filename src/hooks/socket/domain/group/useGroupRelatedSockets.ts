import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import upsert from "@/utils/array/upsert"
import queryKeys from "@/utils/queryKeys"
import { wsEventNames } from "@/utils/wsEventNames"
import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { useMySocketEvent } from "../../useMySocketEvent"

export const useGroupRelatedSockets = (groupId: string | undefined) => {
  const { sendMessage: sendEnterGroupMessage, socket } = useMySocketEvent<
    string
  >("enter-group")

  useEffect(() => {
    console.log({ groupId, sendEnterGroupMessage })
    if (groupId && socket.connected) sendEnterGroupMessage(groupId)
  }, [groupId, socket.connected])

  const { lastMessage: lastMessageSaveIdea } = useMySocketEvent<{
    idea: IdeaDto
    groupId: string
  }>("saveIdea")
  const queryClient = useQueryClient()

  const { lastMessage: lastMessageDeleteIdea } = useMySocketEvent<{
    idea: IdeaDto
    groupId: string
  }>(wsEventNames.deleteIdea)
  useEffect(() => {
    if (lastMessageSaveIdea && groupId) {
      queryClient.setQueryData<IdeaDto[]>(
        queryKeys.groupIdeas(groupId),
        (curr) =>
          upsert(
            curr,
            lastMessageSaveIdea.idea,
            (i) => i.id === lastMessageSaveIdea.idea.id
          )
      )
    }
  }, [lastMessageSaveIdea])

  useEffect(() => {
    if (lastMessageDeleteIdea?.groupId) {
      queryClient.setQueryData<IdeaDto[]>(
        queryKeys.groupIdeas(lastMessageDeleteIdea.groupId),
        (curr) => pushOrRemove(curr || [], lastMessageDeleteIdea.idea, "id")
      )
    }
  }, [lastMessageDeleteIdea])

  const { lastMessage: lastMessageMoveIdeasToTab } = useMySocketEvent<
    IdeaDto[]
  >(wsEventNames.moveIdeasToTab)
  useEffect(() => {
    if (!lastMessageMoveIdeasToTab) return

    for (const idea of lastMessageMoveIdeasToTab) {
      queryClient.setQueryData<IdeaDto[]>(
        queryKeys.groupIdeas(groupId!),
        (curr) => {
          if (!curr) return [idea]
          return upsert(curr, idea, (i) => i.id === idea.id)
        }
      )
    }
  }, [lastMessageMoveIdeasToTab])
}
