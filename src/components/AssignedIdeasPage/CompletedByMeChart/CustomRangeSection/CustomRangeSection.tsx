import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexHCenter from "@/components/_common/flexboxes/FlexHCenter"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import { localStorageKeys } from "@/utils/localStorageKeys"
import { pluralize } from "@/utils/text/pluralize"
import { useLocalStorage } from "@mantine/hooks"
import { Typography } from "@mui/material"
import { DesktopDatePicker } from "@mui/x-date-pickers"
import { useMemo } from "react"

type Props = {}

export const CustomRangeSection = ({ ...props }: Props) => {
  const [customInitialDate, setCustomInitialDate] = useLocalStorage<
    string | null
  >({
    key: localStorageKeys.highlyRatedPage.customInitialDate,
    defaultValue: null,
  })
  const [customFinalDate, setCustomFinalDate] = useLocalStorage<string | null>({
    key: localStorageKeys.highlyRatedPage.customFinalDate,
    defaultValue: null,
  })

  const { data } = useAssignedToMeQuery()
  const completedIdeasInRange = useMemo(() => {
    return (data ?? []).filter((d) => {
      if (!d.idea.completedAt) {
        return false
      }
      const completedAtDate = new Date(d.idea.completedAt)

      if (customInitialDate && completedAtDate < new Date(customInitialDate)) {
        return false
      }

      if (customFinalDate && completedAtDate > new Date(customFinalDate)) {
        return false
      }

      return true
    })
  }, [data, customInitialDate, customFinalDate])

  const label = useMemo(() => {
    if (!completedIdeasInRange.length) {
      return <Typography>No ideas completed</Typography>
    }

    return (
      <Typography>
        {completedIdeasInRange.length}{" "}
        {pluralize({
          count: completedIdeasInRange.length,
          word: "idea",
        })}{" "}
        completed
      </Typography>
    )
  }, [completedIdeasInRange, customInitialDate, customFinalDate])

  return (
    <FlexCol className="CustomRangeSection" gap={2}>
      <FlexVCenter gap={1}>
        <DesktopDatePicker
          label="From"
          renderInput={(params) => (
            <MyTextField
              {...params}
              sx={{
                width: 140,
              }}
            />
          )}
          onChange={(val) => {
            setCustomInitialDate(val)
          }}
          value={customInitialDate}
        />

        <DesktopDatePicker
          label="To"
          renderInput={(params) => (
            <MyTextField
              {...params}
              sx={{
                width: 140,
              }}
            />
          )}
          onChange={(val) => {
            setCustomFinalDate(val)
          }}
          value={customFinalDate}
        />
      </FlexVCenter>
      <FlexHCenter>{label}</FlexHCenter>
    </FlexCol>
  )
}
