import { Box, Button } from "@mui/material";
import React from "react";
import Flex from "../../flexboxes/Flex";

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
        Save
      </Button>

      <Box ml={1}>
        <Button onClick={props.onCancel} variant="outlined">
          Cancel
        </Button>
      </Box>
    </Flex>
  );
};

interface Props {
  submitButtonId?: string;
  disabled?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

export default SaveCancelButtons;
