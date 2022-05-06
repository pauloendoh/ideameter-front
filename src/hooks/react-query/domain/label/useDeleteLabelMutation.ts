import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import LabelDto from "@/types/domain/label/LabelDto";
import { pushOrRemove } from "@/utils/array/pushOrRemove";
import myAxios from "@/utils/axios/myAxios";
import urls from "@/utils/urls";
import { useMutation, useQueryClient } from "react-query";

const useDeleteLabelMutation = () => {
  const queryClient = useQueryClient();
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  return useMutation(
    (id: string) =>
      myAxios.delete<LabelDto>(urls.api.labelId(id)).then((res) => res.data),
    {
      onSuccess: (deleted) => {
        setSuccessMessage("Deleted!");

        const queryData = queryClient.getQueryData<LabelDto[]>(
          urls.api.groupLabels(deleted.groupId)
        );

        if (!queryData) return;

        const newQueryData = pushOrRemove(queryData, deleted, "id");
        queryClient.setQueryData(
          urls.api.groupLabels(deleted.groupId),
          newQueryData
        );
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useDeleteLabelMutation;
