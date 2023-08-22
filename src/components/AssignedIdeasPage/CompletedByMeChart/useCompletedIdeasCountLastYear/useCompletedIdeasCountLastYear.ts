import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import { DateTime } from "luxon"
import { useMemo } from "react"

type IdeaCount = {
  key: string
  count: number
}

export const useCompletedIdeasCountLastYear = (
  type: "count" | "complexity" = "count"
) => {
  const { data: ideas } = useAssignedToMeQuery()

  const completedIdeas = useMemo(
    () => ideas?.filter((i) => i.idea.isDone) || [],
    [ideas]
  )

  const ideasCountLast12Months = useMemo(() => {
    const months: DateTime[] = []
    for (let i = 12; i >= 0; i--) {
      const month = DateTime.local().plus({ month: i * -1 })
      months.push(month)
    }

    const ideaCountPerMonth = []
    for (const month of months) {
      const ideaCountMonth: IdeaCount = {
        key: month.toFormat("LLL/yy"),
        count: 0,
      }

      const ideasFromMonth = completedIdeas.filter((idea) => {
        const completedAt = DateTime.fromISO(idea.idea.completedAt!)
        return (
          completedAt.month === month.month && completedAt.year === month.year
        )
      })

      ideaCountMonth.count = ideasFromMonth.length
      if (type === "complexity") {
        ideaCountMonth.count = ideasFromMonth.reduce((acc, curr) => {
          return acc + curr.idea.complexity
        }, 0)
      }

      ideaCountPerMonth.push(ideaCountMonth)
    }

    return ideaCountPerMonth
  }, [completedIdeas, type])

  return ideasCountLast12Months
}
