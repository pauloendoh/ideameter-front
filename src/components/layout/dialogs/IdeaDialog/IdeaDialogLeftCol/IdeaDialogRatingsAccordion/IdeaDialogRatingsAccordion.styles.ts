import { Accordion, styled } from "@mui/material"

const S = {
  Accordion: styled(Accordion)(() => ({
    "th, td": {
      padding: 4,
      borderBottom: "none",
    },
  })),
}

export default S
