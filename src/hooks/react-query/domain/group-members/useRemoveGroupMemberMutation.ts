import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import UserGroupDto from "@/types/domain/group/UserGroupDto"
import { UserGroupIdDto } from "@/types/domain/user-group/UserGroupIdDto"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"

export const useRemoveGroupMemberMutation = () => {
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const queryClient = useQueryClient()

  return useMutation(
    (payload: UserGroupIdDto) =>
      myAxios
        .delete<UserGroupDto>(urls.api.groupUser(payload.groupId, payload.userId))
        .then((res) => res.data),
    {
      onSuccess: (_, payload) => {
        queryClient.setQueryData<UserGroupDto[]>(
          queryKeys.groupMembers(payload.groupId),
          (curr) =>
            curr?.filter(
              (groupUser) =>
                groupUser.groupId === payload.groupId &&
                groupUser.userId !== payload.userId
            ) || []
        )

        setSuccessMessage("Member removed!")
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err))
      },
    }
  )
}
