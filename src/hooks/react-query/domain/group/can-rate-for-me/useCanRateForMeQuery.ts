import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { useQuery } from "react-query"
import { CanRateForMeDto } from "./types/CanRateForMeDto"

export const useCanRateForMeQuery = (input: { groupId?: string }) => {
  const axios = useAxios()
  const { authUser } = useAuthStore()
  return useQuery(
    urls.api.canRateForMe(input.groupId!),
    () =>
      axios
        .get<CanRateForMeDto[]>(urls.api.canRateForMe(input.groupId!))
        .then((res) => res.data),
    {
      enabled: !!authUser?.id && !!input.groupId,
    }
  )
}
