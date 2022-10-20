import { buildIdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import { buildLabelDto } from "@/types/domain/label/LabelDto"
import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import { useFilterAndSortIdeaRatings } from "./useFilterAndSortIdeaRatings"

describe("useFilterAndSortIdeaRatings", () => {
  describe("when you have 2 ideas, and 1 of them have a label, and you filter by that label", async () => {
    test("it should return '1'", async () => {
      const Test = () => {
        const labelId = "labelId"

        const ideaRatings = useFilterAndSortIdeaRatings({
          authUserId: "",
          filter: {
            labelIds: [labelId],
            onlyCompletedIdeas: false,
            onlyHighImpactVoted: false,
            requiresYourRating: false,
            users: [],
          },
          ideaRatings: [
            buildIdeaRating({
              idea: buildIdeaDto({ labels: [buildLabelDto({ id: labelId })] }),
            }),
            buildIdeaRating({ idea: buildIdeaDto() }),
          ],
          ideaRequiresYourRating: () => false,
          ratings: [],
          sortingBy: {
            attribute: "avgRating",
            order: "desc",
          },
        })
        return <>{ideaRatings.length}</>
      }

      render(<Test />)

      screen.logTestingPlaygroundURL()
      expect(screen.getByText("1")).toBeDefined()
    })
  })
})
