import { NotificationDto } from "@/types/domain/notification/NotificationDto"
import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"

const useHideNotificationDotsMutation = () => {
  const queryClient = useQueryClient()

  const axios = useAxios()

  return useMutation(
    () =>
      axios
        .delete<NotificationDto[]>(urls.api.notificationsHideDots)
        .then((res) => res.data),
    {
      onSuccess: (notifications) => {
        queryClient.setQueryData<NotificationDto[]>(
          queryKeys.notifications,
          notifications
        )
      },
    }
  )
}

export default useHideNotificationDotsMutation
