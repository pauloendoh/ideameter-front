import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import { valueIsOneOf } from "endoh-utils"
import { useMemo } from "react"

export function useAssignedToMeCount(input: {
  ratedIdeas: AssignedToMeDto[]
  hiddenTabsIds: string[]
}) {
  const { ratedIdeas: assignedIdeas, hiddenTabsIds } = input

  const assignedToMeCount = useMemo(() => {
    if (!assignedIdeas) {
      return 0
    }

    return assignedIdeas.filter((idea) => {
      if (!idea.iAmAssigned) {
        return false
      }

      if (idea.idea.completedAt) {
        return false
      }

      if (valueIsOneOf(idea.tab.tabId, hiddenTabsIds)) {
        return false
      }

      return true
    }).length
  }, [assignedIdeas])

  return assignedToMeCount
}
