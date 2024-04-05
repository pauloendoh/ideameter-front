import React from "react"
import { format } from "timeago.js"

type Props = {
  createdAt: string
  spanProps?: React.HTMLAttributes<HTMLSpanElement>
}

const TimeagoSpan = React.forwardRef<HTMLSpanElement, Props>((props, ref) => {
  return (
    <span
      ref={ref}
      title={new Date(props.createdAt).toLocaleString()}
      style={{
        cursor: "help",
        textDecoration: "underline",
        textDecorationStyle: "dotted",
      }}
      {...props.spanProps}
    >
      {format(props.createdAt)}
    </span>
  )
})

export default TimeagoSpan
