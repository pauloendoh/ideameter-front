import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import TabDto from "@/types/domain/group/tab/TabDto";
import pushOrReplace from "@/utils/array/pushOrReplace";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useMutation, useQueryClient } from "react-query";

const useSaveTabMutation = () => {
  const queryClient = useQueryClient();
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  return useMutation(
    (payload: TabDto) =>
      myAxios
        .request<TabDto>({
          url: urls.api.groupTab(payload.groupId),
          data: payload,
          method: payload.id ? "PUT" : "POST",
        })
        .then((res) => res.data),
    {
      onSuccess: (savedTab) => {
        const groupTabs = queryClient.getQueryData<TabDto[]>(
          queryKeys.groupTabs(savedTab.groupId)
        );

        const newGroupTabs = pushOrReplace(groupTabs, savedTab, "id");

        queryClient.setQueryData(
          queryKeys.groupTabs(savedTab.groupId),
          newGroupTabs
        );
        setSuccessMessage("Tab saved!");
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useSaveTabMutation;
