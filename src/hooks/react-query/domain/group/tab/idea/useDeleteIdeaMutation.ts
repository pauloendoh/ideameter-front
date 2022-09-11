import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import deleteFromArray from "@/utils/array/deleteFromArray";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useMutation, useQueryClient } from "react-query";

interface Variables {
  idea: IdeaDto;
}

const useDeleteIdeaMutation = () => {
  const queryClient = useQueryClient();
  const { groupId } = useRouterQueryString();
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  return useMutation(
    ({ idea }: Variables) =>
      myAxios.delete(urls.api.ideaId(idea.id)).then((res) => res.data),
    {
      onSuccess: (_, { idea }) => {
        setSuccessMessage("Idea deleted!");

        if (groupId)
          queryClient.setQueryData<IdeaDto[]>(
            queryKeys.groupIdeas(groupId),
            (curr) => {
              return deleteFromArray(curr, (i) => i.id === idea.id);
            }
          );
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useDeleteIdeaMutation;
