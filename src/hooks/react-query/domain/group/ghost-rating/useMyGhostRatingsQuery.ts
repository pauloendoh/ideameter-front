import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { useQuery } from "react-query"
import { GhostRatingDto } from "./types/GhostRatingDto"

export const useMyGhostRatingsQuery = (input: { groupId: string }) => {
  const axios = useAxios()
  const { authUser } = useAuthStore()
  return useQuery(
    urls.api.getMyGhostRatings(input.groupId),
    () =>
      axios
        .get<GhostRatingDto[]>(urls.api.getMyGhostRatings(input.groupId))
        .then((res) => res.data),
    {
      enabled: !!authUser?.id && !!input.groupId,
    }
  )
}
