import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import GroupMemberDto from "@/types/domain/group/GroupMemberDto";
import pushOrReplace from "@/utils/array/pushOrReplace";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useMutation, useQueryClient } from "react-query";

const useAddMemberMutation = () => {
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  const queryClient = useQueryClient();

  return useMutation(
    (params: { groupId: string; memberId: string }) =>
      myAxios
        .post<GroupMemberDto>(
          urls.api.groupMemberId(params.groupId, params.memberId)
        )
        .then((res) => res.data),
    {
      onSuccess: (newMember, params) => {
        const groupMembers = queryClient.getQueryData<GroupMemberDto[]>(
          queryKeys.groupMembers(params.groupId)
        );

        const newGroupMembers = pushOrReplace(groupMembers, newMember, "id");

        queryClient.setQueryData(
          queryKeys.groupMembers(params.groupId),
          newGroupMembers
        );
        setSuccessMessage("Member added!");
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useAddMemberMutation;
