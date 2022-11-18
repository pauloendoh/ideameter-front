import { useMySocketEvent } from "@/hooks/socket/useMySocketEvent"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import upsert from "@/utils/array/upsert"
import queryKeys from "@/utils/queryKeys"
import { wsEventNames } from "@/utils/wsEventNames"
import { useEffect } from "react"
import { useQueryClient } from "react-query"

export const useSavedRatingSocket = () => {
  const { lastMessage: data } = useMySocketEvent<{
    groupId: string
    savedRating: RatingDto
  }>(wsEventNames.savedRating)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!data) return

    queryClient.setQueryData<RatingDto[]>(
      queryKeys.ratingsByGroup(data.groupId),
      (curr) => upsert(curr, data.savedRating, (r) => r.id === data.savedRating.id)
    )
  }, [data])
}
