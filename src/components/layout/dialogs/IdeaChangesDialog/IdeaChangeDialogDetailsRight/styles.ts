import FlexCol from "@/components/_common/flexboxes/FlexCol"
import { styled } from "@mui/material"

export const S = {
  FlexCol: styled(FlexCol)(({ theme }) => ({
    a: {
      color: theme.palette.grey[100],
    },
  })),
}
