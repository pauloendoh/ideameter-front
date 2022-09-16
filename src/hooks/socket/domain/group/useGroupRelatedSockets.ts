import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import upsert from "@/utils/array/upsert"
import queryKeys from "@/utils/queryKeys"
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

  const { lastMessage } = useMySocketEvent<{ idea: IdeaDto; groupId: string }>(
    "saveIdea"
  )
  const queryClient = useQueryClient()

  useEffect(() => {
    if (lastMessage && groupId) {
      queryClient.setQueryData<IdeaDto[]>(
        queryKeys.groupIdeas(groupId),
        (curr) =>
          upsert(curr, lastMessage.idea, (i) => i.id === lastMessage.idea.id)
      )
    }
  }, [lastMessage])
}
