import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import UserGroupDto from "@/types/domain/group/UserGroupDto"
import { UserGroupIdDto } from "@/types/domain/user-group/UserGroupIdDto"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"

export const useDismissAdminMutation = () => {
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const queryClient = useQueryClient()

  return useMutation(
    (payload: UserGroupIdDto) =>
      myAxios
        .delete<UserGroupDto>(urls.api.groupAdmin, {
          data: payload,
        })
        .then((res) => res.data),
    {
      onSuccess: (_, payload) => {
        queryClient.invalidateQueries(queryKeys.groupMembers(payload.groupId))

        setSuccessMessage("Admin dismissed!")
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err))
      },
    }
  )
}
