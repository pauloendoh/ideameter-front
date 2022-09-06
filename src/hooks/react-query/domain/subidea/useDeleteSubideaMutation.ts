import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import deleteFromArray from "@/utils/array/deleteFromArray";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useMutation, useQueryClient } from "react-query";

interface Variables {
  subidea: IdeaDto;
  groupId: string;
}

const useDeleteSubideaMutation = () => {
  const queryClient = useQueryClient();
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  return useMutation(
    ({ subidea }: Variables) =>
      myAxios
        .delete<IdeaDto>(urls.api.subideaId(subidea.id))
        .then((res) => res.data),
    {
      onSuccess: (_, { subidea, groupId }) => {
        setSuccessMessage("Subidea deleted!");

        queryClient.setQueryData<IdeaDto[]>(
          queryKeys.subideas(groupId),
          (curr) => {
            return deleteFromArray(curr, (i) => i.id === subidea.id);
          }
        );
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useDeleteSubideaMutation;
