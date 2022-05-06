import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import pushOrReplace from "@/utils/array/pushOrReplace";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";

const useSaveIdeaMutation = () => {
  const queryClient = useQueryClient();
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  return useMutation(
    (payload: IdeaDto) =>
      myAxios
        .request<IdeaDto>({
          url: urls.api.tabIdea(payload.tabId as string),
          data: payload,
          method: payload.id ? "PUT" : "POST",
        })
        .then((res) => res.data),
    {
      onSuccess: (savedIdea) => {
        if (savedIdea.tabId) {
          const tabIdeas = queryClient.getQueryData<IdeaDto[]>(
            queryKeys.tabIdeas(savedIdea.tabId)
          );

          const newTabIdeas = pushOrReplace(tabIdeas, savedIdea, "id");

          queryClient.setQueryData(
            queryKeys.tabIdeas(savedIdea.tabId),
            newTabIdeas
          );
        }

        setSuccessMessage("Idea saved!");
      },
      onError: (err: AxiosError<string>) => {
        setErrorMessage(err?.response?.statusText || "Error saving idea");
      },
    }
  );
};

export default useSaveIdeaMutation;
