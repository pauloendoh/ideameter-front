import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import queryKeys from "@/utils/queryKeys"
import { useHotkeys } from "react-hotkeys-hook"
import { useQueryClient } from "react-query"

export const useToggleVoteHotkey = (ideaId: string | null) => {
  const { mutate: submitSaveIdea } = useSaveIdeaMutation()

  const { groupId } = useRouterQueryString()
  const queryClient = useQueryClient()
  const authUser = useAuthStore((s) => s.authUser)

  return useHotkeys(
    "v",
    () => {
      if (ideaId && groupId) {
        const groupIdeas = queryClient.getQueryData<IdeaDto[]>(
          queryKeys.groupIdeas(groupId)
        )
        if (!groupIdeas) return
        const idea = groupIdeas.find((i) => i.id === ideaId)
        if (!idea) return

        idea.highImpactVotes = pushOrRemove(
          idea.highImpactVotes,
          { ideaId, userId: authUser!.id },
          "userId"
        )
        submitSaveIdea(idea)
      }
    },
    [ideaId, groupId]
  )
}
