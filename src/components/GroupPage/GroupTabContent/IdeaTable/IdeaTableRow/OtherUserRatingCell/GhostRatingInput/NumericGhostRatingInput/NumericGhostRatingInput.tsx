import { useNumericGhostRatingDialogStore } from "@/hooks/zustand/dialogs/useNumericGhostRatingDialogStore"
import { Button } from "@mui/material"

type Props = {
  myCurrentRating: number | null
  targetUserId: string
  ideaId: string
  groupId: string
}

export const NumericGhostRatingInput = ({ ...props }: Props) => {
  const { openDialog } = useNumericGhostRatingDialogStore()

  return (
    <Button
      variant="contained"
      onClick={(e) => {
        e.stopPropagation()
        openDialog({
          initialValue: {
            rating: props.myCurrentRating,
            groupId: props.groupId,
            ideaId: props.ideaId,
            targetUserId: props.targetUserId,
          },
        })
      }}
    >
      {props.myCurrentRating ?? "Rate"}
    </Button>
  )
}
