import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import UserGroupDto from "@/types/domain/group/UserGroupDto"
import myAxios from "@/utils/axios/myAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { produce } from "immer"
import { useMutation, useQueryClient } from "react-query"

const useAddMemberMutation = () => {
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const queryClient = useQueryClient()

  return useMutation(
    (params: { groupId: string; memberId: string }) =>
      myAxios
        .post<UserGroupDto>(urls.api.groupMemberId(params.groupId, params.memberId))
        .then((res) => res.data),
    {
      onSuccess: (newMember, params) => {
        const groupUsers = queryClient.getQueryData<UserGroupDto[]>(
          queryKeys.groupMembers(params.groupId)
        )

        const newGroupUsers = produce(groupUsers, (draft) => {
          if (!draft) draft = [newMember]
          const index = draft.findIndex((ug) => ug.userId === newMember.userId)
          if (index === -1) draft.push(newMember)
          else draft[index] = newMember
          return draft
        })

        queryClient.setQueryData(queryKeys.groupMembers(params.groupId), newGroupUsers)
        setSuccessMessage("Member added!")
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err))
      },
    }
  )
}

export default useAddMemberMutation
