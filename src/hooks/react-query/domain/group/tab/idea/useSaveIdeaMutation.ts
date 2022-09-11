import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import upsert from "@/utils/array/upsert";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";

const useSaveIdeaMutation = () => {
  const queryClient = useQueryClient();
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();
  const { groupId } = useRouterQueryString();

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
        if (groupId) {
          queryClient.setQueryData<IdeaDto[]>(
            queryKeys.groupIdeas(groupId),
            (curr) => upsert(curr, savedIdea, (i) => i.id === savedIdea.id)
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
