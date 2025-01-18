import { Header } from "@/components/AssignedIdeasPage/AssignedIdeasTableHead/AssignedIdeasTableHead"
import { MyRatedIdeasSortingByType } from "@/hooks/zustand/domain/my-rated-ideas/MyRatedIdeasSortingByType/MyRatedIdeasSortingByType"
import { useMyRatedIdeasStore } from "@/hooks/zustand/domain/my-rated-ideas/useMyRatedIdeasStore"
import React, { useMemo } from "react"

const headers = [
  {
    title: "#",
    width: 64,
    align: "center",
  },
  {
    title: "idea",
    width: 360,
    align: "left",
  },
  {
    title: "Result (XP)",
    width: 100,
    align: "center",
  },
  {
    title: "Reward",
    width: 100,
    align: "center",
  },
  {
    title: "Discomfort Zone",
    width: 100,
    align: "center",
  },
  {
    title: "Group",
    width: 200,
    align: "left",
  },
  {
    title: "Tab",
    width: 200,
    align: "left",
  },
] as Header[]

export const useMyRatedIdeasTableHeaders = () => {
  const resultingHeaders = useMemo(() => {
    const result = [...headers]

    result[2].reactNode = (
      <SortableHeaderSpan value="result">Result (XP)</SortableHeaderSpan>
    )
    result[3].reactNode = (
      <SortableHeaderSpan value={"reward"}>Reward</SortableHeaderSpan>
    )
    result[4].reactNode = (
      <SortableHeaderSpan value="discomfort">
        Discomfort Zone
      </SortableHeaderSpan>
    )

    return result
  }, [])

  return resultingHeaders
}

const SortableHeaderSpan = (props: {
  value: MyRatedIdeasSortingByType
  children: React.ReactNode
}) => {
  const { sortingBy, setSortingBy } = useMyRatedIdeasStore()
  return (
    <span
      onClick={() => setSortingBy(props.value)}
      style={{
        cursor: "pointer",
      }}
    >
      {props.children} {sortingBy === props.value && "↓"}
    </span>
  )
}
