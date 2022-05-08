import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import pushOrReplace from "@/utils/array/pushOrReplace";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";

const useSaveSubideaMutation = () => {
  const queryClient = useQueryClient();
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  return useMutation(
    (payload: IdeaDto) =>
      myAxios
        .request<IdeaDto>({
          url: urls.api.subideas(payload.parentId as string),
          data: payload,
          method: payload.id ? "PUT" : "POST",
        })
        .then((res) => res.data),
    {
      onSuccess: (savedIdea) => {
        if (savedIdea.parentId) {
          const subideas = queryClient.getQueryData<IdeaDto[]>(
            queryKeys.subideas(savedIdea.parentId)
          );

          const newSubideas = pushOrReplace(subideas, savedIdea, "id");

          queryClient.setQueryData(
            queryKeys.subideas(savedIdea.parentId),
            newSubideas
          );
        }

        setSuccessMessage("Subidea saved!");
      },
      onError: (err: AxiosError<string>) => {
        setErrorMessage(err?.response?.data || "Error saving subidea");
      },
    }
  );
};

export default useSaveSubideaMutation;
