import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import { useRateYourInterestDialogStore } from "@/hooks/zustand/dialogs/useRateYourInterestDialogStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"

type Props = {
  myCurrentRating: number
  handleChange: (newRating: number) => void

  groupId: string
  idea: IdeaDto
}

export const NumericRatingInputButton = ({
  myCurrentRating,
  handleChange,
  ...props
}: Props) => {
  const { openDialog: openRateYourInterestDialog } =
    useRateYourInterestDialogStore()

  return (
    <DarkButton
      onClick={(e) => {
        e.stopPropagation()
        openRateYourInterestDialog({
          initialValue: {
            rating: myCurrentRating,
            groupId: props.groupId,
            ideaId: props.idea.id,
          },
          onSave: (newRating) => {
            handleChange(newRating)
          },
        })
      }}
    >
      {myCurrentRating === -1
        ? "Rate"
        : myCurrentRating === 0
        ? "-"
        : myCurrentRating}
    </DarkButton>
  )
}
