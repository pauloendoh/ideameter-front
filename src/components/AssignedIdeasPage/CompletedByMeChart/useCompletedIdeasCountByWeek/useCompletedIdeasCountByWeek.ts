import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import { useMemo } from "react"

type IdeaCount = {
  key: string
  count: number
}

export const useCompletedIdeasCountByWeek = (
  type: "count" | "complexity" = "count"
) => {
  const { data: ideas } = useAssignedToMeQuery()

  const completedIdeas = useMemo(
    () => ideas?.filter((i) => i.idea.isDone) || [],
    [ideas]
  )

  const result = useMemo(() => {
    // const months: DateTime[] = []
    // for (let i = 12; i >= 0; i--) {
    //   const month = DateTime.local().plus({ month: i * -1 })
    //   months.push(month)
    // }

    // const ideaCountPerMonth = []
    // for (const month of months) {
    //   const ideaCountMonth: IdeaCount = {
    //     key: month.toFormat("LLL/yy"),
    //     count: 0,
    //   }

    //   const ideasFromMonth = completedIdeas.filter((idea) => {
    //     const completedAt = DateTime.fromISO(idea.idea.completedAt!)
    //     return (
    //       completedAt.month === month.month && completedAt.year === month.year
    //     )
    //   })

    //   ideaCountMonth.count = ideasFromMonth.length
    //   if (type === "complexity") {
    //     ideaCountMonth.count = ideasFromMonth.reduce((acc, curr) => {
    //       return acc + curr.idea.complexity
    //     }, 0)
    //   }

    //   ideaCountPerMonth.push(ideaCountMonth)
    // }

    // return ideaCountPerMonth

    const startingDays: Date[] = [] // starts on mondays

    const lastMonday = new Date()
    lastMonday.setDate(lastMonday.getDate() - lastMonday.getDay() + 1) // getDay (of week)

    // past 9 weeks + current week
    for (let i = 0; i < 10; i++) {
      const day = new Date()
      day.setDate(lastMonday.getDate() - i * 7)
      day.setHours(0, 0, 0, 0)
      startingDays.push(day)
    }

    const sortedStartingDays = [...startingDays].sort(
      (a, b) => a.getTime() - b.getTime()
    )

    const result: IdeaCount[] = []

    console.log({
      sortedStartingDays,
    })
    for (const day of sortedStartingDays) {
      const startingDay = new Date(day)
      const finishedDay = new Date(day)
      finishedDay.setDate(finishedDay.getDate() + 6)

      const formattedStartingDay = startingDay.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })

      const formattedFinishedDay = finishedDay.getDate()

      const ideaCount: IdeaCount = {
        // key: day format "MMM/dd~dd"
        key: `${formattedStartingDay}-${formattedFinishedDay}`,
        count: 0,
      }

      const ideasFromWeek = completedIdeas.filter((idea) => {
        const completedAt = new Date(idea.idea.completedAt!)
        return (
          completedAt.getTime() >= startingDay.getTime() &&
          completedAt.getTime() <= finishedDay.getTime()
        )
      })

      ideaCount.count = ideasFromWeek.length
      if (type === "complexity") {
        ideaCount.count = ideasFromWeek.reduce((acc, curr) => {
          return acc + curr.idea.complexity
        }, 0)
      }

      result.push(ideaCount)
    }

    return result
  }, [completedIdeas, type])

  return result
}
