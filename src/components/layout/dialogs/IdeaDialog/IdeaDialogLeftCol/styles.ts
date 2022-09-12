import { Box, styled } from "@mui/material";

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
      borderBottom: `1px solid ${theme.palette.grey[600]}`,
    },
    ".mantine-RichTextEditor-toolbarGroup": {
      background: "none",
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
    },
  })),
};
