import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material"

import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import MyTextField from "@/components/_common/inputs/MyTextField"
import { useGroupQueryUtils } from "@/hooks/react-query/domain/group/useGroupQueryUtils"
import { useIdeaQueryUtils } from "@/hooks/react-query/domain/idea/useIdeaQueryUtils"
import { useRateYourInterestDialogStore } from "@/hooks/zustand/dialogs/useRateYourInterestDialogStore"
import { useEffect, useRef, useState } from "react"

export const RateYourInterestDialog = () => {
  const { initialValues, isOpen, close, onSave } =
    useRateYourInterestDialogStore()

  const [localValues, setLocalValues] = useState(initialValues)

  const currentGroup = useGroupQueryUtils(localValues.groupId)
  const selectedIdea = useIdeaQueryUtils({
    groupId: localValues.groupId,
    ideaId: localValues.ideaId,
  })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setLocalValues(initialValues)
      setTimeout(() => {
        inputRef.current?.select()
      }, 200)
    }
  }, [isOpen])

  const handleSubmit = () => {
    if (typeof localValues.rating === "number") {
      onSave(localValues.rating)
    }
    close()
  }

  return (
    <Dialog
      onClose={close}
      open={isOpen}
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          width: "400px",
        },
      }}
    >
      <DialogTitle
        sx={{
          paddingBottom: 0,
        }}
      >
        Rate your interest
      </DialogTitle>

      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <FlexCol mt={1} gap={4}>
            <Typography
              sx={{
                fontStyle: "italic",
              }}
            >
              {selectedIdea?.name}
            </Typography>
            {!!currentGroup && (
              <MyTextField
                inputRef={inputRef}
                type="number"
                label={`Your rating (Min: ${currentGroup.minRating}; Max: ${currentGroup.maxRating})`}
                value={(localValues.rating ?? 0) >= 0 ? localValues.rating : ""}
                defaultValue={
                  (localValues.rating ?? 0) >= 0 ? localValues.rating : ""
                }
                inputProps={{
                  min: currentGroup.minRating,
                  max: currentGroup.maxRating,

                  step: 0.1,
                }}
                onChange={(e) => {
                  let val = Number(e.target.value)

                  if (e.target.value === "" || isNaN(val)) return

                  const min = currentGroup.minRating
                  if (val < min) {
                    val = min
                  }

                  const max = currentGroup.maxRating
                  if (val > max) {
                    val = max
                  }

                  setLocalValues((prev) => ({
                    ...prev,
                    rating: val,
                  }))
                }}
              />
            )}

            <SaveCancelButtons
              onEnabledAndCtrlEnter={handleSubmit}
              onCancel={close}
            />
          </FlexCol>
        </form>
      </DialogContent>
    </Dialog>
  )
}
