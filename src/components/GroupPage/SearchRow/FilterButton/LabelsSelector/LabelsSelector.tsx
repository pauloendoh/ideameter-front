import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupLabelsQuery from "@/hooks/react-query/domain/label/useGroupLabelsQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import LabelDto from "@/types/domain/label/LabelDto"
import { Autocomplete } from "@mui/lab"
import { Chip } from "@mui/material"
import { useMemo } from "react"
import LabelSelectorOption from "./LabelSelectorOption/LabelSelectorOption"

interface Props {
  selectedLabelIds?: string[]
  onChange: (labelIds: string[]) => void
  inputLabel?: string
  inputRef?: React.RefObject<HTMLInputElement>
}

const LabelsSelector = (props: Props) => {
  const { groupId } = useRouterQueryString()

  const { data: labels } = useGroupLabelsQuery(groupId)

  const sortedLabels = useMemo(() => {
    // by position
    const sorted =
      labels?.sort((a, b) => (a.position > b.position ? 1 : -1)) || []
    return [...sorted]
  }, [labels])

  const value = useMemo(() => {
    return sortedLabels?.filter((label) =>
      props.selectedLabelIds?.includes(label.id)
    )
  }, [props.selectedLabelIds, sortedLabels])

  return (
    <Autocomplete
      multiple
      id="tags-standard"
      options={sortedLabels}
      value={value}
      onKeyDown={(e) => {
        e.stopPropagation()
      }}
      disableCloseOnSelect
      onChange={(e, values) => {
        if (typeof values === "string") return
        const labels = values as LabelDto[]

        const labelIds = labels.map((label) => label.id)

        props.onChange(labelIds)
      }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      renderInput={(params) => (
        <MyTextField
          {...params}
          label={props.inputLabel || "Labels"}
          size="small"
          inputRef={props.inputRef}
        />
      )}
      renderOption={(liProps, label) => (
        <LabelSelectorOption liProps={liProps} label={label} />
      )}
      renderTags={(labels, getTagProps) =>
        labels.map((label, index) => (
          <Chip
            {...getTagProps({ index })}
            size="small"
            label={label.name}
            style={{ backgroundColor: label.bgColor }}
          />
        ))
      }
    />
  )
}

export default LabelsSelector
