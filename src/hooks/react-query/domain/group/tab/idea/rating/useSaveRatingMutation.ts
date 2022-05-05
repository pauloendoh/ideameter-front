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
    ({ payload }: { payload: RatingDto; groupId: string }) =>
      myAxios
        .request<RatingDto>({
          url: urls.api.ideaRating,
          data: payload,
          method: payload.id ? "PUT" : "POST",
        })
        .then((res) => res.data),
    {
      onSuccess: (savedRating, variables) => {
        const groupRatings = queryClient.getQueryData<RatingDto[]>(
          queryKeys.ratingsByGroup(variables.groupId)
        );

        const newGroupRatinsg = pushOrReplace(groupRatings, savedRating, "id");

        queryClient.setQueryData(
          queryKeys.ratingsByGroup(variables.groupId),
          newGroupRatinsg
        );

        setSuccessMessage("Rating saved!");
      },
      onError: (err) => {
        setErrorMessage(JSON.stringify(err));
      },
    }
  );
};

export default useSaveRatingMutation;
