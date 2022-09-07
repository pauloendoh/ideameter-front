import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto";
import pushOrReplace from "@/utils/array/pushOrReplace";
import upsert from "@/utils/array/upsert";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useMutation, useQueryClient } from "react-query";

interface ResponseData {
  savedRating: RatingDto;
  idea: IdeaDto;
}

const useSaveRatingMutation = () => {
  const queryClient = useQueryClient();
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore();

  return useMutation(
    ({
      payload,
    }: {
      payload: RatingDto;
      groupId: string;
      parentIdeaId?: string;
    }) =>
      myAxios
        .request<ResponseData>({
          url: urls.api.ideaRating(payload.ideaId),
          data: payload,
          method: payload.id ? "PUT" : "POST",
        })
        .then((res) => res.data),
    {
      onSuccess: ({ savedRating, idea }, { groupId, parentIdeaId }) => {
        if (parentIdeaId) {
          queryClient.invalidateQueries(queryKeys.subideaRatings(parentIdeaId));
          return;
        }

        queryClient.setQueryData<IdeaDto[]>(
          queryKeys.tabIdeas(idea.tabId!),
          (curr) => {
            return upsert(curr, idea, (i) => i.id === idea.id);
          }
        );

        const groupRatings = queryClient.getQueryData<RatingDto[]>(
          queryKeys.ratingsByGroup(groupId)
        );
        const newGroupRatings = pushOrReplace(groupRatings, savedRating, "id");
        queryClient.setQueryData(
          queryKeys.ratingsByGroup(groupId),
          newGroupRatings
        );
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useSaveRatingMutation;
