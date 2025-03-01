import { useMemo } from "react"
import useGroupIdeasQuery from "../group/idea/useGroupIdeasQuery"

export const useIdeaQueryUtils = (input: {
  groupId: string
  ideaId: string
}) => {
  const { data: groupIdeas } = useGroupIdeasQuery(input.groupId)

  const idea = useMemo(() => {
    if (!groupIdeas) {
      return null
    }

    return groupIdeas.find((i) => i.id === input.ideaId) ?? null
  }, [groupIdeas, input.ideaId])

  return idea
}
