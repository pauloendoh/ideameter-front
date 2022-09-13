import { useScrollToIdea } from "@/hooks/domain/idea/useScrollToIdea";
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import upsert from "@/utils/array/upsert";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";

const useSaveIdeaMutation = (highlightAfterSave = true) => {
  const scrollToIdea = useScrollToIdea();
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
      onSuccess: (savedIdea, payload) => {
        if (groupId) {
          queryClient.setQueryData<IdeaDto[]>(
            queryKeys.groupIdeas(groupId),
            (curr) => {
              return upsert(curr, savedIdea, (i) => i.id === savedIdea.id);
            }
          );
        }

        queryClient.invalidateQueries(queryKeys.tabIdeas(savedIdea.tabId!));

        if (payload.id === null && groupId)
          queryClient.invalidateQueries(queryKeys.ratingsByGroup(groupId));

        setSuccessMessage("Idea saved!");

        if (highlightAfterSave) scrollToIdea(savedIdea.id);
      },
      onError: (err: AxiosError<string>) => {
        setErrorMessage(err?.response?.statusText || "Error saving idea");
      },
    }
  );
};

export default useSaveIdeaMutation;
