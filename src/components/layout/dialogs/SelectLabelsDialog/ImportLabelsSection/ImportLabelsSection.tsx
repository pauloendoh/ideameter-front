import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useImportLabelsMutation from "@/hooks/react-query/domain/label/useImportLabelsMutation"
import useLabelsToImportQuery from "@/hooks/react-query/domain/label/useLabelsToImportQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import { ImportLabelPostDto } from "@/types/domain/label/ImportLabelPostDto"
import LabelDto from "@/types/domain/label/LabelDto"
import { Autocomplete, Box, Chip } from "@mui/material"
import { useRouter } from "next/router"
import { useMemo, useRef, useState } from "react"
import LabelSelectorOption from "../../ImportLabelsDialog/LabelSelectorOption/LabelSelectorOption"

type Props = {
  close: () => void
}

const ImportLabelsSection = (props: Props) => {
  const router = useRouter()
  const inputRef = useRef<HTMLDivElement>(null)

  const { groupId } = useRouterQueryString()
  const { data: labels } = useLabelsToImportQuery(groupId)

  const sortedLabels = useMemo(
    () =>
      labels?.sort(
        (a, b) =>
          a.group?.name.localeCompare(b.group?.name || "") || a.name.localeCompare(b.name)
      ) || [],
    [labels]
  )

  const { mutate, isLoading } = useImportLabelsMutation()

  const [selectedLabels, setSelectedLabels] = useState<LabelDto[]>([])

  const onSubmit = () => {
    if (!groupId) return
    const dtos: ImportLabelPostDto[] = selectedLabels.map((label) => ({
      bgColor: label.bgColor,
      name: label.name,
    }))

    mutate(
      {
        groupId: groupId,
        labels: dtos,
      },
      {
        onSuccess: (savedTab) => {
          props.close()
        },
      }
    )
  }

  return (
    <Box mt={2}>
      <Autocomplete
        sx={{ mt: 1 }}
        multiple
        options={sortedLabels}
        value={selectedLabels}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(e, values) => {
          if (typeof values === "string") return
          const labels = values as LabelDto[]

          setSelectedLabels(labels)
        }}
        getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
        renderInput={(params) => (
          <MyTextField {...params} label="Import Labels" size="small" />
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

      <Box mt={2}>
        <SaveCancelButtons
          onSave={onSubmit}
          isLoadingAndDisabled={isLoading}
          onCancel={props.close}
          saveText="Import"
        />
      </Box>
    </Box>
  )
}

export default ImportLabelsSection
