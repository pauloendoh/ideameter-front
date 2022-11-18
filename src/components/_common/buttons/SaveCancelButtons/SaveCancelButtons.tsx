import { Box, Button } from "@mui/material"
import { useHotkeys } from "react-hotkeys-hook"
import Flex from "../../flexboxes/Flex"

interface Props {
  submitButtonId?: string
  disabled?: boolean
  onSave?: () => void
  onCancel?: () => void
  saveText?: string
  onEnabledAndCtrlEnter?: () => void
}

const SaveCancelButtons = (props: Props) => {
  useHotkeys(
    "Ctrl+Enter",
    () => {
      if (!props.disabled && props.onEnabledAndCtrlEnter) {
        props.onEnabledAndCtrlEnter()
      }
    },
    {
      enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
    }
  )

  return (
    <Flex>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        id={props.submitButtonId}
        disabled={props.disabled}
        onClick={props.onSave}
      >
        {props.saveText || "Save"}
      </Button>

      <Box ml={1}>
        <Button onClick={props.onCancel} variant="outlined">
          Cancel
        </Button>
      </Box>
    </Flex>
  )
}

export default SaveCancelButtons
