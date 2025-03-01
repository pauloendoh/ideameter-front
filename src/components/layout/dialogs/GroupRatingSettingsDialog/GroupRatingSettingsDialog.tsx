import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"

import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import { useGroupRatingSettingsDialogStore } from "@/hooks/zustand/dialogs/useGroupRatingSettingsDialogStore"
import { useEffect, useMemo, useState } from "react"

const GroupRatingSettingsDialog = () => {
  const { initialValue, isOpen, close, onSave } =
    useGroupRatingSettingsDialogStore()

  const [values, setValues] = useState(initialValue)

  useEffect(() => {
    if (isOpen) {
      setValues(initialValue)
    }
  }, [isOpen])

  const quantity = useMemo(() => {
    return values.maxRating - values.minRating + 1
  }, [values])

  const minMaxIsDirty = useMemo(() => {
    return (
      values.minRating !== initialValue.minRating ||
      values.maxRating !== initialValue.maxRating
    )
  }, [initialValue, values])

  const handleSubmit = () => {
    onSave(values)
    close()
  }

  return (
    <Dialog onClose={close} open={isOpen} fullWidth maxWidth="xs">
      <DialogTitle>Group rating settings</DialogTitle>

      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <FlexCol mt={1} gap={4}>
            <FlexCol gap={2}>
              <FormControl size="small">
                <InputLabel id="rating-input-type-label">
                  Rating input type
                </InputLabel>
                <Select
                  size="small"
                  value={values.ratingInputType}
                  label="Rating input type"
                  labelId="rating-input-type-label"
                  onChange={(e) => {
                    setValues((prev) => ({
                      ...prev,
                      ratingInputType: e.target.value as any,
                    }))
                  }}
                >
                  <MenuItem value="dropdown">Dropdown (with labels)</MenuItem>
                  <MenuItem value="numeric">
                    Numeric (eg: 3.6 out of 5)
                  </MenuItem>
                </Select>
              </FormControl>
              <FlexVCenter gap={1}>
                <MyTextField
                  type="number"
                  label="Min rating"
                  value={values.minRating}
                  defaultValue={values.minRating}
                  onChange={(e) => {
                    let val = Number(e.target.value)

                    if (e.target.value === "" || isNaN(val)) return

                    const min = 1
                    if (val < min) {
                      val = min
                    }

                    setValues((prev) => ({
                      ...prev,
                      minRating: val,
                    }))
                  }}
                />
                <MyTextField
                  type="number"
                  label="Max rating"
                  value={values.maxRating}
                  defaultValue={values.maxRating}
                  onChange={(e) => {
                    let val = Number(e.target.value)

                    if (e.target.value === "" || isNaN(val)) return

                    const min = values.minRating
                    if (val < min) {
                      val = min
                    }

                    setValues((prev) => ({
                      ...prev,
                      maxRating: val,
                    }))
                  }}
                />
              </FlexVCenter>

              {values.ratingInputType === "dropdown" && (
                <FlexCol>
                  <span>Value labels</span>
                  <FlexCol gap={2} mt={2}>
                    {Array.from({ length: quantity }).map((_, i) => (
                      <div key={i}>
                        <MyTextField
                          required
                          fullWidth
                          defaultValue={values.dropdownValueLabels[i] || ""}
                          label={`Rating ${i + values.minRating}`}
                          value={values.dropdownValueLabels[i]}
                          onChange={(e) => {
                            const val = e.target.value

                            setValues((prev) => ({
                              ...prev,
                              dropdownValueLabels: [
                                ...prev.dropdownValueLabels.slice(0, i),
                                val,
                                ...prev.dropdownValueLabels.slice(i + 1),
                              ],
                            }))
                          }}
                        />
                      </div>
                    ))}
                  </FlexCol>
                </FlexCol>
              )}
            </FlexCol>

            <FlexCol gap={1}>
              {minMaxIsDirty && (
                <Typography color="orange" variant="body2">
                  Changing min/max rating will normalize current ratings to the
                  new scale
                </Typography>
              )}
              <Typography></Typography>

              <SaveCancelButtons onCancel={close} />
            </FlexCol>
          </FlexCol>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default GroupRatingSettingsDialog
