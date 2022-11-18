import { useMySocketEvent } from "@/hooks/socket/useMySocketEvent"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import deleteFromArray from "@/utils/array/deleteFromArray"
import queryKeys from "@/utils/queryKeys"
import { wsEventNames } from "@/utils/wsEventNames"
import { useEffect } from "react"
import { useQueryClient } from "react-query"

export const useDeletedRatingSocket = () => {
  const { lastMessage } = useMySocketEvent<{ ratingId: string; groupId: string }>(
    wsEventNames.deletedRating
  )
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!lastMessage) return

    console.log({
      lastMessage,
    })

    queryClient.setQueryData<RatingDto[]>(
      queryKeys.ratingsByGroup(lastMessage.groupId),
      (curr) => deleteFromArray(curr, (r) => r.id === lastMessage.ratingId)
    )
  }, [lastMessage])
}
