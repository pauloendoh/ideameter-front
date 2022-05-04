import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import GroupDto from "@/types/domain/group/GroupDto";
import pushOrReplace from "@/utils/array/pushOrReplace";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useMutation, useQueryClient } from "react-query";

const useSaveGroupMutation = () => {
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  const queryClient = useQueryClient();

  return useMutation(
    (payload: GroupDto) =>
      myAxios
        .request<GroupDto>({
          url: urls.api.group,
          data: payload,
          method: payload.id ? "PUT" : "POST",
        })
        .then((res) => res.data),
    {
      onSuccess: (saved) => {
        const groups = queryClient.getQueryData<GroupDto[]>(queryKeys.groups);

        const newGroups = pushOrReplace(groups, saved, "id");

        queryClient.setQueryData(queryKeys.groups, newGroups);
        setSuccessMessage("Group saved!");
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useSaveGroupMutation;
