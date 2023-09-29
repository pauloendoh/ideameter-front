import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { deleteFromArray } from "endoh-utils"
import { useCallback, useMemo } from "react"

export const useToggleHighImpactVote = (params: {
  idea: IdeaDto
  onSuccess?: () => void
}) => {
  const { authUser } = useAuthStore()
  const { mutate: submitSaveIdea } = useSaveIdeaMutation()

  const youVotedHighImpact = useMemo(
    () =>
      Boolean(
        params.idea.highImpactVotes?.find((v) => v.userId === authUser!.id)
      ),
    [params.idea.highImpactVotes, authUser]
  )

  const callback = useCallback(() => {
    if (!authUser || !params.idea.highImpactVotes) return

    const idea = { ...params.idea }

    if (!youVotedHighImpact) {
      idea.highImpactVotes = [
        ...idea.highImpactVotes,
        { ideaId: idea.id, userId: authUser.id },
      ]
      submitSaveIdea(idea, {
        onSuccess: () => {
          params.onSuccess?.()
        },
      })
      return
    }

    idea.highImpactVotes = deleteFromArray(
      idea.highImpactVotes,
      (v) => v.userId === authUser.id
    )
    submitSaveIdea(idea, {
      onSuccess: () => {
        params.onSuccess?.()
      },
    })
    return
  }, [params.idea.highImpactVotes, authUser, youVotedHighImpact])

  return callback
}
