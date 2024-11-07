import NextLink from "next/link"
import React from "react"

type Props = React.ComponentProps<typeof NextLink>

const MyNextLink = React.forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  return (
    <NextLink
      ref={ref}
      {...props}
      passHref
      style={{
        textDecoration: "none",
        color: "inherit",
        width: "fit-content",
        ...props.style,
      }}
      onClick={(e) => {
        if (props.onClick) {
          props.onClick(e)
        }
      }}
    >
      {props.children}
    </NextLink>
  )
})

export default MyNextLink
