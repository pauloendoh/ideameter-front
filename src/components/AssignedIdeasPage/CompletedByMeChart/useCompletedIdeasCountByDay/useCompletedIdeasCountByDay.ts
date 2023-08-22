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
    // const startingDays: Date[] = []

    // const lastMonday = new Date()
    // lastMonday.setDate(lastMonday.getDate() - lastMonday.getDay() + 1) // getDay (of week)

    // // past 9 weeks + current week
    // for (let i = 0; i < 10; i++) {
    //   const day = new Date()
    //   day.setDate(lastMonday.getDate() - i * 7)
    //   startingDays.push(day)
    // }

    // const sortedStartingDays = startingDays.sort(
    //   (a, b) => a.getTime() - b.getTime()
    // )

    // const result: IdeaCount[] = []

    // for (const day of sortedStartingDays) {
    //   const startingDay = new Date(day)
    //   const finishedDay = new Date(day)
    //   finishedDay.setDate(finishedDay.getDate() + 6)

    //   const formattedStartingDay = startingDay.toLocaleDateString("en-US", {
    //     month: "short",
    //     day: "numeric",
    //   })

    //   const formattedFinishedDay = finishedDay.getDate()

    //   const ideaCount: IdeaCount = {
    //     // key: day format "MMM/dd~dd"
    //     key: `${formattedStartingDay}-${formattedFinishedDay}`,
    //     count: 0,
    //   }

    //   const ideasFromWeek = completedIdeas.filter((idea) => {
    //     const completedAt = new Date(idea.idea.completedAt!)
    //     return (
    //       completedAt.getTime() >= startingDay.getTime() &&
    //       completedAt.getTime() <= finishedDay.getTime()
    //     )
    //   })

    //   ideaCount.count = ideasFromWeek.length
    //   if (type === "complexity") {
    //     ideaCount.count = ideasFromWeek.reduce((acc, curr) => {
    //       return acc + curr.idea.complexity
    //     }, 0)
    //   }

    //   result.push(ideaCount)
    // }

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

    return result.sort((a, b) => a.key.localeCompare(b.key))
  }, [completedIdeas, type])

  return result
}
