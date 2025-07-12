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

    const assignedToMe = assignedIdeas.filter((aIdea) => {
      if (!aIdea.iAmAssigned) {
        return false
      }

      if (aIdea.idea.completedAt) {
        return false
      }

      if (valueIsOneOf(aIdea.tab.tabId, hiddenTabsIds)) {
        return false
      }

      return true
    })

    console.log({
      assignedToMe,
    })

    return assignedToMe.length
  }, [assignedIdeas])

  return assignedToMeCount
}
