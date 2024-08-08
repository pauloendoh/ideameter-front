import { useMySocketEvent } from "@/hooks/socket/useMySocketEvent"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import queryKeys from "@/utils/queryKeys"
import { socketEvents } from "@/utils/socketEvents"
import { upsert } from "endoh-utils"
import { useEffect } from "react"
import { useQueryClient } from "react-query"

export const useMovedIdeasWSListener = (groupId: string) => {
  const { lastMessage: movedIdeas } = useMySocketEvent<IdeaDto[]>(
    socketEvents.moveIdeasToTab
  )
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!movedIdeas) return

    for (const idea of movedIdeas) {
      queryClient.setQueryData<IdeaDto[]>(
        queryKeys.groupIdeas(groupId),
        (curr) => {
          if (!curr) return [idea]
          return upsert(curr, idea, (i) => i.id === idea.id)
        }
      )
    }
  }, [movedIdeas])
}
