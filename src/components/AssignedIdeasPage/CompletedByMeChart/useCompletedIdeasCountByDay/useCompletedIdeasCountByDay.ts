import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import { useMemo } from "react"

type IdeaCount = {
  key: string
  count: number
}

export const useCompletedIdeasCountByDay = (
  type: "count" | "complexity" = "count"
) => {
  const { data: ideas } = useAssignedToMeQuery()

  const completedIdeas = useMemo(
    () => ideas?.filter((i) => i.idea.isDone) || [],
    [ideas]
  )

  const result = useMemo(() => {
    const result: IdeaCount[] = []

    // last 6 days + today
    for (let i = 0; i < 7; i++) {
      const day = new Date()
      day.setDate(day.getDate() - i)
      const formattedDay = day.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })

      const ideaCount: IdeaCount = {
        key: formattedDay,
        count: 0,
      }

      const ideasFromDay = completedIdeas.filter((idea) => {
        const completedAt = new Date(idea.idea.completedAt!)
        return (
          completedAt.getDate() === day.getDate() &&
          completedAt.getMonth() === day.getMonth() &&
          completedAt.getFullYear() === day.getFullYear()
        )
      })

      ideaCount.count = ideasFromDay.length
      if (type === "complexity") {
        ideaCount.count = ideasFromDay.reduce((acc, curr) => {
          return acc + curr.idea.complexity
        }, 0)
      }

      result.push(ideaCount)
    }

    result.reverse()

    return result
  }, [completedIdeas, type])

  console.log(result)

  return result
}
