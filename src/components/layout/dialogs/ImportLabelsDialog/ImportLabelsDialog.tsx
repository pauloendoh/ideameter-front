import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useSaveTabMutation from "@/hooks/react-query/domain/group/tab/useSaveTabMutation"
import useLabelsToImportQuery from "@/hooks/react-query/domain/label/useLabelsToImportQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import TabDto from "@/types/domain/group/tab/TabDto"
import LabelDto from "@/types/domain/label/LabelDto"
import urls from "@/utils/urls"
import {
  Autocomplete,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"
import { MdClose } from "react-icons/md"
import LabelSelectorOption from "./LabelSelectorOption/LabelSelectorOption"

type Props = {
  dialogIsOpen: boolean
  closeDialog: () => void
}

const ariaLabel = "import-labels-dialog"

const ImportLabelsDialog = (props: Props) => {
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

  const { mutate, isLoading } = useSaveTabMutation()

  const [selectedLabels, setSelectedLabels] = useState<LabelDto[]>([])

  useEffect(() => {
    if (props.dialogIsOpen) {
      setSelectedLabels([])
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [props.dialogIsOpen])

  const onSubmit = (values: TabDto) => {
    mutate(values, {
      onSuccess: (savedTab) => {
        props.closeDialog()
        router.push(urls.pages.groupTab(savedTab.groupId, savedTab.id))
      },
    })
  }

  return (
    <Dialog
      open={props.dialogIsOpen}
      onClose={props.closeDialog}
      fullWidth
      maxWidth="xs"
      aria-labelledby={ariaLabel}
      sx={{ top: 30 }}
    >
      <Box pb={1}>
        {/* <form> */}
        <DialogTitle id={`${ariaLabel}-title`}>
          <FlexVCenter justifyContent="space-between">
            <Typography variant="h5">Import Labels</Typography>

            <IconButton onClick={props.closeDialog}>
              <MdClose />
            </IconButton>
          </FlexVCenter>
        </DialogTitle>

        <DialogContent>
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
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            renderInput={(params) => (
              <MyTextField {...params} label="Labels" size="small" />
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
        </DialogContent>

        <DialogTitle>
          <SaveCancelButtons
            isLoadingAndDisabled={isLoading}
            onCancel={props.closeDialog}
          />
        </DialogTitle>
        {/* </form> */}
      </Box>
    </Dialog>
  )
}

export default ImportLabelsDialog
