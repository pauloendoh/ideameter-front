import { useMySocketEvent } from "@/hooks/socket/useMySocketEvent"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import deleteFromArray from "@/utils/array/deleteFromArray"
import queryKeys from "@/utils/queryKeys"
import { wsEventNames } from "@/utils/wsEventNames"
import { useEffect } from "react"
import { useQueryClient } from "react-query"

export const useDeletedRatingSocket = (groupId?: string) => {
  const { lastMessage: lastDeletedRating } = useMySocketEvent<RatingDto>(
    wsEventNames.deletedRating
  )
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!groupId || !lastDeletedRating) return

    queryClient.setQueryData<RatingDto[]>(queryKeys.ratingsByGroup(groupId), (curr) =>
      deleteFromArray(curr, (r) => r.id === lastDeletedRating.id)
    )
  }, [groupId, lastDeletedRating])
}
