import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import TabDto from "@/types/domain/group/tab/TabDto";
import { pushOrRemove } from "@/utils/array/pushOrRemove";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useMutation, useQueryClient } from "react-query";

const useDeleteTabMutation = () => {
  const queryClient = useQueryClient();
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  return useMutation(
    (payload: TabDto) =>
      myAxios
        .delete<TabDto>(urls.api.groupTab(payload.groupId), {
          data: payload,
        })
        .then((res) => res.data),
    {
      onSuccess: (savedTab) => {
        setSuccessMessage("Tab deleted!");

        const groupTabs = queryClient.getQueryData<TabDto[]>(
          queryKeys.groupTabs(savedTab.groupId)
        );

        if (!groupTabs) return;

        const newGroupTabs = pushOrRemove(groupTabs, savedTab, "id");

        queryClient.setQueryData(
          queryKeys.groupTabs(savedTab.groupId),
          newGroupTabs
        );
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useDeleteTabMutation;
