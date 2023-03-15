import { buildIdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import { buildLabelDto } from "@/types/domain/label/LabelDto"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"
import { useFilterAndSortIdeaRatings } from "./useFilterAndSortIdeaRatings"

describe("useFilterAndSortIdeaRatings", () => {
  afterEach(() => {
    cleanup()
  })
  describe("when you have 2 ideas, and 1 of them have a label, and you filter by that label", async () => {
    test("it should return '1'", async () => {
      const Test = () => {
        const labelId = "labelId"

        const ideaRatings = useFilterAndSortIdeaRatings({
          authUserId: "",
          filter: {
            labelIds: [labelId],
            excludeLabelIds: [],
            onlyCompletedIdeas: false,
            onlyHighImpactVoted: false,
            requiresYourRating: false,
            users: [],
            minRatingCount: 0,
            minAvgRating: 0,
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

      expect(screen.getByText("1")).toBeDefined()
    })
  })

  describe("when subidea table, AND you have subideas with avgRating 1,3 and 2, AND you're ordering by createdAt", async () => {
    test("the avgRating 3 should come first", async () => {
      const Test2 = () => {
        const ideaRatings = useFilterAndSortIdeaRatings({
          isSubideasTable: true,
          authUserId: "",
          filter: {
            labelIds: [],
            excludeLabelIds: [],
            onlyCompletedIdeas: false,
            onlyHighImpactVoted: false,
            requiresYourRating: false,
            users: [],
            minRatingCount: 0,
            minAvgRating: 0,
          },
          ideaRatings: [
            buildIdeaRating({
              idea: buildIdeaDto(),
              avgRating: 1,
            }),
            buildIdeaRating({ idea: buildIdeaDto(), avgRating: 3 }),
            buildIdeaRating({ idea: buildIdeaDto(), avgRating: 2 }),
          ],
          ideaRequiresYourRating: () => false,
          ratings: [],
          sortingBy: {
            attribute: "createdAt",
            order: "desc",
          },
        })
        return <>{ideaRatings[0].avgRating}</>
      }

      render(<Test2 />)

      screen.logTestingPlaygroundURL()
      expect(screen.getByText("3")).toBeDefined()
    })
  })
})
