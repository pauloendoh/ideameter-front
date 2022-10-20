import TestProviders from "@/components/Providers/TestProviders"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { buildAuthUserGetDto } from "@/types/domain/auth/AuthUserGetDto"
import { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import TabDto, { buildTabDto } from "@/types/domain/group/tab/TabDto"
import queryKeys from "@/utils/queryKeys"
import { render, screen } from "@testing-library/react"
import { useEffect } from "react"
import { useQueryClient } from "react-query"
import { describe, expect, test } from "vitest"
import GroupTabItem from "./GroupTabItem"

describe("GroupTabItem", () => {
  test("When user is authenticated, and group has tab, and tab has one idea with one subidea -> it should appear '1'", async () => {
    const Test = () => {
      const queryClient = useQueryClient()

      const groupId = "123"

      const tab = buildTabDto({
        name: "tab name",
      })

      const setAuthUser = useAuthStore((s) => s.setAuthUser)

      useEffect(() => {
        setAuthUser(buildAuthUserGetDto())
        queryClient.setQueryData<TabDto[]>(queryKeys.groupTabs(groupId), () => [tab])
        queryClient.setQueryData(queryKeys.ratingsByGroup(groupId), () => [])

        queryClient.setQueryData(queryKeys.tabIdeas(tab.id), () => [
          buildIdeaDto({
            id: "parentIdea",
          }),
        ])

        queryClient.setQueryData(queryKeys.subideas(groupId), () => [
          buildIdeaDto({
            parentId: "parentIdea",
          }),
        ])
      }, [])

      return <GroupTabItem groupId={groupId} tab={tab} />
    }

    render(
      <TestProviders>
        <Test />
      </TestProviders>
    )

    screen.logTestingPlaygroundURL()

    expect(screen.getByText("1")).toBeDefined()
  })
})
