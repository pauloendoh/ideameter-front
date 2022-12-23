import { HighImpactVoteDto } from "@/types/domain/high-impact-votes/HighImpactVoteDto"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import { useHotkeys } from "react-hotkeys-hook"

export const useToggleVoteFromDialog = (params: {
  dialogIsOpen: boolean
  currentVotes: HighImpactVoteDto[]
  ideaId: string
  userId: string
  onChange: (value: HighImpactVoteDto[]) => void
}) => {
  const { dialogIsOpen, currentVotes, ideaId, userId, onChange } = params

  useHotkeys(
    "v",
    () => {
      if (!dialogIsOpen) return

      const newVotes = pushOrRemove(currentVotes, { ideaId, userId }, "userId")

      onChange(newVotes)
    },
    [dialogIsOpen, currentVotes]
  )
}
