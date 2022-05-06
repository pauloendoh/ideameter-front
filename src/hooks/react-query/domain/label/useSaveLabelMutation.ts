import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import LabelDto from "@/types/domain/label/LabelDto";
import pushOrReplace from "@/utils/array/pushOrReplace";
import myAxios from "@/utils/axios/myAxios";
import urls from "@/utils/urls";
import { useMutation, useQueryClient } from "react-query";

const useSaveLabelMutation = () => {
  const queryClient = useQueryClient();
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  return useMutation(
    (payload: LabelDto) =>
      myAxios
        .request<LabelDto>({
          url: urls.api.groupLabels(payload.groupId),
          data: payload,
          method: payload.id ? "PUT" : "POST",
        })
        .then((res) => res.data),
    {
      onSuccess: (saved) => {
        const currentQueryData = queryClient.getQueryData<LabelDto[]>(
          urls.api.groupLabels(saved.groupId)
        );

        const newQueryData = pushOrReplace(currentQueryData, saved, "id");

        queryClient.setQueryData(
          urls.api.groupLabels(saved.groupId),

          newQueryData
        );
        setSuccessMessage("Label saved!");
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useSaveLabelMutation;
