import { LoadingButton } from "@mui/lab"
import { Box, Button } from "@mui/material"
import { useHotkeys } from "react-hotkeys-hook"
import Flex from "../../flexboxes/Flex"

interface Props {
  submitButtonId?: string
  disabled?: boolean
  isLoadingAndDisabled?: boolean
  onSave?: () => void
  onCancel?: () => void
  saveText?: string
  onEnabledAndCtrlEnter?: () => void
  onEnableAndCtrlS?: () => void
  hideCancel?: boolean
  saveIcon?: React.ReactNode
  saveWidth?: number
}

const SaveCancelButtons = (props: Props) => {
  useHotkeys(
    "ctrl+enter",
    () => {
      if (!props.disabled && props.onEnabledAndCtrlEnter) {
        props.onEnabledAndCtrlEnter()
      }
    },
    {
      enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
    },
    [props.disabled, props.onEnabledAndCtrlEnter]
  )

  useHotkeys(
    "ctrl+s",
    (e) => {
      e.preventDefault()
      if (
        !props.disabled &&
        !props.isLoadingAndDisabled &&
        props.onEnableAndCtrlS
      ) {
        props.onEnableAndCtrlS()
      }
    },
    {
      enableOnTags: ["INPUT", "SELECT", "TEXTAREA"],
    },
    [props]
  )

  return (
    <Flex>
      <LoadingButton
        loading={props.isLoadingAndDisabled}
        type="submit"
        variant="contained"
        color="primary"
        id={props.submitButtonId}
        disabled={props.disabled}
        onClick={props.onSave}
        startIcon={props.saveIcon}
        sx={{ width: props.saveWidth }}
      >
        {props.saveText || "Save"}
      </LoadingButton>

      {!props.hideCancel && (
        <Box ml={1}>
          <Button onClick={props.onCancel} variant="outlined">
            Cancel
          </Button>
        </Box>
      )}
    </Flex>
  )
}

export default SaveCancelButtons
