import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import { useCallback } from "react"

export const useIdeaRequiresYourRating = (
  ideaRatings: IdeaRating[],
  groupRatings?: RatingDto[]
) => {
  const authUser = useAuthStore((s) => s.authUser)

  const ideaRequiresYourRating = useCallback(
    (ideaId: string) => {
      const ideaRating = ideaRatings.find((ir) => ir.idea.id === ideaId)

      if (ideaRating && authUser && groupRatings) {
        if (ideaRating.idea.isDone) return false

        const youRatedIdeaIds = groupRatings
          .filter((r) => r.userId === authUser.id)
          .map((i) => i.ideaId)

        for (const subidea of ideaRating.subideas) {
          if (!youRatedIdeaIds.includes(subidea.id)) {
            return true
          }
        }

        if (!youRatedIdeaIds.includes(ideaRating.idea.id)) {
          return true
        }
      }

      return false
    },
    [ideaRatings, groupRatings, authUser]
  )

  return ideaRequiresYourRating
}
