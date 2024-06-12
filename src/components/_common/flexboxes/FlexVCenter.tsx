import { Box } from "@mui/material"
import React from "react"

type Props = React.ComponentProps<typeof Box>

// forwardRef
const FlexVCenter = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <Box display="flex" alignItems="center" {...props} ref={ref}>
      {props.children}
    </Box>
  )
})

export default FlexVCenter
