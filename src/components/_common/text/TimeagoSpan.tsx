import React from "react"
import { format } from "timeago.js"

type Props = {
  date: string
  dotted?: boolean
  spanProps?: React.HTMLAttributes<HTMLSpanElement>
}

const TimeagoSpan = React.forwardRef<HTMLSpanElement, Props>((props, ref) => {
  return (
    <span
      ref={ref}
      title={new Date(props.date).toLocaleString()}
      style={{
        cursor: "help",
        textDecoration: props.dotted ? "underline" : "unset",
        textDecorationStyle: props.dotted ? "dotted" : "unset",
      }}
      {...props.spanProps}
    >
      {format(props.date)}
    </span>
  )
})

export default TimeagoSpan
