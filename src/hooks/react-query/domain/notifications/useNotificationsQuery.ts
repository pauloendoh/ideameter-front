import { NotificationDto } from "@/types/domain/notification/NotificationDto"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useQuery } from "react-query"

const useNotificationsQuery = (refetchOnWindowFocus = true) => {
  const query = useQuery(queryKeys.notifications, () =>
    myAxios
      .get<NotificationDto[]>(urls.api.notifications)
      .then((res) => res.data)
  )
  return query
}

export default useNotificationsQuery
