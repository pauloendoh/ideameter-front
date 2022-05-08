import { useTheme } from "@mui/material";
import React from "react";
import ReactLinkify from "react-linkify";

type Props = React.ComponentProps<typeof ReactLinkify> & {
  openNewTab?: boolean;
  stopPropagation?: boolean;
};

const MyReactLinkify = (props: Props) => {
  const theme = useTheme();
  const componentDecorator = (href: string, text: string, key: number) => (
    <a
      href={href}
      key={key}
      target={props.openNewTab ? "_blank" : undefined}
      rel={props.openNewTab ? "noopener noreferrer" : undefined}
      style={{
        color: theme.palette.primary.main,
        fontWeight: "inherit",
        textDecoration: "underline",
      }}
      onClick={(e) => {
        if (props.stopPropagation) e.stopPropagation();
      }}
    >
      {text}
    </a>
  );

  return <ReactLinkify componentDecorator={componentDecorator} {...props} />;
};

export default MyReactLinkify;
