import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import UserGroupDto from "@/types/domain/group/UserGroupDto"
import { UserGroupIdDto } from "@/types/domain/user-group/UserGroupIdDto"
import upsert from "@/utils/array/upsert"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"

export const useMakeAdminMutation = () => {
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const queryClient = useQueryClient()

  return useMutation(
    (payload: UserGroupIdDto) =>
      myAxios.post<UserGroupDto>(urls.api.groupAdmin, payload).then((res) => res.data),
    {
      onSuccess: (savedUserGroup, payload) => {
        queryClient.setQueryData<UserGroupDto[]>(
          queryKeys.groupMembers(payload.groupId),
          (curr) =>
            upsert(
              curr,
              savedUserGroup,
              (ug) =>
                ug.groupId === savedUserGroup.groupId &&
                ug.userId === savedUserGroup.userId
            )
        )

        setSuccessMessage("Admin saved!")
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err))
      },
    }
  )
}
