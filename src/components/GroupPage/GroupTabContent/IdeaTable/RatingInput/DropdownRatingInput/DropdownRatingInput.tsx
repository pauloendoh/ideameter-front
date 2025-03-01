import { useCurrentGroup } from "@/hooks/domain/group/useCurrentGroup"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { NativeSelect } from "@mui/material"
import { useMemo } from "react"

type Props = {
  myCurrentRating: number
  handleChange: (newRating: number) => void
  isLoading: boolean
  isDisabled: boolean | undefined
}

export const DropdownRatingInput = ({
  myCurrentRating,
  isLoading,
  handleChange,
  ...props
}: Props) => {
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

  return (
    <NativeSelect
      key={myCurrentRating}
      disabled={isLoading}
      variant="outlined"
      size="small"
      inputProps={{
        disabled: props.isDisabled,
        title: props.isDisabled ? "Ratings are disabled for this idea" : "",
      }}
      // value={currentRating}
      sx={{ width: 40, textAlignLast: "right" }}
      defaultValue={myCurrentRating}
      onChange={(e) => {
        handleChange(Number(e.target.value))
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {authUser?.username === "pauloendoh" && (
        <option value={-2}>Refresh</option>
      )}
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
