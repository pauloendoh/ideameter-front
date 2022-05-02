import { TextField } from "@mui/material";
import React from "react";
import { MdClear } from "react-icons/md";

type Props = React.ComponentProps<typeof TextField> & {
  onCtrlEnter?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onClickClearIcon?: () => void;
};

const MyTextField = React.forwardRef<HTMLDivElement, Props>(
  ({ onCtrlEnter = (e) => {}, ...props }, ref) => {
    return (
      <TextField
        size="small"
        autoComplete="off"
        variant="outlined"
        InputProps={
          props.onClickClearIcon
            ? {
                endAdornment: (
                  <MdClear
                    style={{ cursor: "pointer" }}
                    onClick={props.onClickClearIcon}
                  />
                ),
              }
            : undefined
        }
        {...props}
        ref={ref}
        onKeyDown={(e) => {
          // I had to add a default function for onCtrlEnter to remove console.error
          if (e.key === "Enter" && e.ctrlKey && onCtrlEnter) {
            onCtrlEnter(e);
          } else if (props.onKeyDown) props.onKeyDown(e);
        }}
      />
    );
  }
);

export default MyTextField;
