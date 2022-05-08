import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto";
import pushOrReplace from "@/utils/array/pushOrReplace";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import { useMutation, useQueryClient } from "react-query";

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
        .request<RatingDto>({
          url: urls.api.ideaRating(payload.ideaId),
          data: payload,
          method: payload.id ? "PUT" : "POST",
        })
        .then((res) => res.data),
    {
      onSuccess: (savedRating, { groupId, parentIdeaId }) => {
        if (parentIdeaId) {
          queryClient.invalidateQueries(queryKeys.subideaRatings(parentIdeaId));
          return;
        }

        const groupRatings = queryClient.getQueryData<RatingDto[]>(
          queryKeys.ratingsByGroup(groupId)
        );
        const newGroupRatinsg = pushOrReplace(groupRatings, savedRating, "id");
        queryClient.setQueryData(
          queryKeys.ratingsByGroup(groupId),
          newGroupRatinsg
        );
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useSaveRatingMutation;
