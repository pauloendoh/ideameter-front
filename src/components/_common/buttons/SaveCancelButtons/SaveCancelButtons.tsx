import { Box, Button } from "@mui/material"
import Flex from "../../flexboxes/Flex"

interface Props {
  submitButtonId?: string
  disabled?: boolean
  onSave?: () => void
  onCancel?: () => void
  saveText?: string
}

const SaveCancelButtons = (props: Props) => {
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
