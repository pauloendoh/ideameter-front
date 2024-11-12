import { Box, styled } from "@mui/material"

export const styles = {
  MantineRteContainer: styled(Box)(({ theme }) => ({
    ".mantine-RichTextEditor-root": {
      border: `1px solid ${theme.palette.grey[700]}`,
      background: "none",
      ":hover": {
        border: `1px solid ${theme.palette.grey[100]}`,
      },
    },
    ".mantine-RichTextEditor-toolbar": {
      background: theme.palette.grey[900],
      borderBottom: "none",
      ".mantine-RichTextEditor-toolbarInner": {
        overflowX: "auto",
        flexWrap: "unset",
      },
    },
    ".mantine-RichTextEditor-toolbarGroup": {
      background: "none",
      flexWrap: "unset",
      button: {
        background: theme.palette.grey[800],
        border: `1px solid ${theme.palette.grey[600]}`,
        svg: {
          color: theme.palette.grey[100],
        },
      },
    },

    ".quill": {
      fontFamily: theme.typography.fontFamily,
      background: theme.palette.grey[900],
      border: "none",
      borderRadius: "0px 0px 4px 4px",
      color: theme.palette.grey[100],
      a: {
        color: theme.palette.primary.main,
      },
    },
    ".ql-editor": {
      minHeight: "80px",
      overflowY: "auto",
      a: {
        textDecoration: "underline",
      },
      p: {
        marginBottom: 0,
      },
      img: {
        maxHeight: 400,
      },
      ".ql-indent-1": {
        marginLeft: "1.5em",
      },
      ".ql-indent-2": {
        marginLeft: "3em",
      },
      ".ql-indent-3": {
        marginLeft: "4.5em",
      },
      ".ql-indent-4": {
        marginLeft: "6em",
      },
      ".ql-indent-5": {
        marginLeft: "7.5em",
      },
      ".ql-indent-6": {
        marginLeft: "9em",
      },
      ".ql-indent-7": {
        marginLeft: "10.5em",
      },
      ".ql-indent-8": {
        marginLeft: "12em",
      },
    },
    ".ql-tooltip": {
      background: theme.palette.grey[900],
      border: `1px solid ${theme.palette.grey[700]}`,
      color: theme.palette.grey[100],

      "> input": {
        background: theme.palette.grey[800],
        color: theme.palette.grey[100],
        "&:focus": {
          border: `1px solid ${theme.palette.primary.main}`,
        },
      },
      ".ql-action::before": {
        backgroundColor: theme.palette.primary.main,
      },
      ".ql-preview": {
        color: theme.palette.primary.main,
      },
    },
  })),
}
