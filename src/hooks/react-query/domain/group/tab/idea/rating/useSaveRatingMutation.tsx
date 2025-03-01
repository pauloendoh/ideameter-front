import { useScrollToIdea } from "@/hooks/domain/idea/useScrollToIdea"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import RatingDto from "@/types/domain/group/tab/idea/rating/RatingDto"
import pushOrReplace from "@/utils/array/pushOrReplace"
import upsert from "@/utils/array/upsert"
import { useAxios } from "@/utils/axios/useAxios"
import queryKeys from "@/utils/queryKeys"
import urls from "@/utils/urls"
import { Link } from "@mui/material"
import { useMutation, useQueryClient } from "react-query"

const useSaveRatingMutation = () => {
  const queryClient = useQueryClient()
  const scrollToIdea = useScrollToIdea()
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const { openDialog } = useIdeaDialogStore()

  const axios = useAxios()
  return useMutation(
    (input: { groupId: string; ideaId: string; rating: number | null }) =>
      axios
        .post<{
          savedRating: RatingDto
          idea: IdeaDto
        }>(urls.api.ideaRating(input.ideaId), {
          rating: input.rating,
        })
        .then((res) => res.data),
    {
      onSuccess: ({ savedRating, idea }, { groupId }) => {
        queryClient.setQueryData<IdeaDto[]>(
          queryKeys.groupIdeas(groupId),
          (curr) => {
            return upsert(curr, idea, (i) => i.id === idea.id)
          }
        )

        const groupRatings = queryClient.getQueryData<RatingDto[]>(
          queryKeys.ratingsByGroup(groupId)
        )
        const newGroupRatings = pushOrReplace(groupRatings, savedRating, "id")
        queryClient.setQueryData(
          queryKeys.ratingsByGroup(groupId),
          newGroupRatings
        )

        setSuccessMessage(
          <>
            Rating saved!{" "}
            {idea.parentId ? null : (
              <Link
                sx={(theme) => ({
                  cursor: "pointer",
                  color: theme.palette.text.primary,
                })}
                onClick={() => openDialog(idea)}
              >
                Open
              </Link>
            )}
          </>
        )

        scrollToIdea(idea.id)
      },
    }
  )
}

export default useSaveRatingMutation
