import { Box } from "@mui/material"
import React, { forwardRef } from "react"

// PE 3/3
const Flex = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <Box display="flex" {...props} ref={ref}>
      {props.children}
    </Box>
  )
})

type Props = React.ComponentProps<typeof Box>

export default Flex
