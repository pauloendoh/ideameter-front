import { useCurrentGroup } from "@/hooks/domain/group/useCurrentGroup"
import { useSaveGhostRatingMutation } from "@/hooks/react-query/domain/group/ghost-rating/useSaveGhostRatingMutation"
import { useMuiTheme } from "@/hooks/utils/useMuiTheme"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { NativeSelect } from "@mui/material"
import { useMemo } from "react"

type Props = {
  myCurrentRating: number | null
  targetUserId: string
  ideaId: string
  groupId: string
}

export const DropdownGhostRatingInput = ({ ...props }: Props) => {
  const { authUser } = useAuthStore()

  const currentGroup = useCurrentGroup()

  const options = useMemo(() => {
    if (!currentGroup) {
      return []
    }

    const range = currentGroup.maxRating - currentGroup.minRating

    return Array.from({ length: range + 1 }, (_, i) => {
      const value = currentGroup.minRating + i
      return {
        value: value,
        label: `${value} - ${currentGroup.dropdownValueLabels?.[i] || ""}`,
      }
    }).reverse()
  }, [currentGroup])

  const { mutate: submitSave, isLoading } = useSaveGhostRatingMutation()

  const theme = useMuiTheme()

  return (
    <NativeSelect
      key={props.myCurrentRating}
      disabled={isLoading}
      variant="outlined"
      size="small"
      // inputProps={{
      //   disabled: props.isDisabled,
      //   title: props.isDisabled ? "Ratings are disabled for this idea" : "",
      // }}
      sx={{
        width: 40,
        textAlignLast: "right",
        background: theme.palette.primary.main,
      }}
      defaultValue={props.myCurrentRating}
      onChange={(e) => {
        submitSave({
          groupId: props.groupId,
          ideaId: props.ideaId,
          rating: Number(e.target.value),
          targetUserId: props.targetUserId,
        })
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {/* invisible character to avoid small height */}

      <option value={-1}>⠀</option>
      <option value={0}>-</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </NativeSelect>
  )
}
