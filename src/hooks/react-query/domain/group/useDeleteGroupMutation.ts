import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import GroupDto from "@/types/domain/group/GroupDto";
import { pushOrRemove } from "@/utils/array/pushOrRemove";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useMutation, useQueryClient } from "react-query";

const useDeleteGroupMutation = () => {
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  const queryClient = useQueryClient();

  return useMutation(
    (groupId: string) =>
      myAxios
        .delete<GroupDto>(urls.api.groupId(groupId))
        .then((res) => res.data),
    {
      onSuccess: (deleted) => {
        setSuccessMessage("Group deleted!");

        const groups = queryClient.getQueryData<GroupDto[]>(queryKeys.groups);

        if (!groups) return;

        const newGroups = pushOrRemove(groups, deleted, "id");
        queryClient.setQueryData(queryKeys.groups, newGroups);
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useDeleteGroupMutation;
