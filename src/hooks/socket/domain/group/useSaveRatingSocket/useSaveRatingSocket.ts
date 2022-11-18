import { useMySocketEvent } from "@/hooks/socket/useMySocketEvent"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import upsert from "@/utils/array/upsert"
import queryKeys from "@/utils/queryKeys"
import { wsEventNames } from "@/utils/wsEventNames"
import { useEffect } from "react"
import { useQueryClient } from "react-query"

export const useSavedRatingSocket = (groupId?: string) => {
  const { lastMessage: lastSavedRating } = useMySocketEvent<RatingDto>(
    wsEventNames.savedRating
  )
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!groupId || !lastSavedRating) return

    queryClient.setQueryData<RatingDto[]>(queryKeys.ratingsByGroup(groupId), (curr) =>
      upsert(curr, lastSavedRating, (r) => r.id === lastSavedRating.id)
    )
  }, [groupId, lastSavedRating])
}
