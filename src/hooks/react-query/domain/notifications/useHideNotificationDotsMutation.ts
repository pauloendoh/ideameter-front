import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { NotificationDto } from "@/types/domain/notification/NotificationDto"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"

const useHideNotificationDotsMutation = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  return useMutation(
    () =>
      myAxios
        .delete<NotificationDto[]>(urls.api.notificationsHideDots)
        .then((res) => res.data),
    {
      onSuccess: (notifications) => {
        queryClient.setQueryData<NotificationDto[]>(
          queryKeys.notifications,
          notifications
        )
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err))
      },
    }
  )
}

export default useHideNotificationDotsMutation
