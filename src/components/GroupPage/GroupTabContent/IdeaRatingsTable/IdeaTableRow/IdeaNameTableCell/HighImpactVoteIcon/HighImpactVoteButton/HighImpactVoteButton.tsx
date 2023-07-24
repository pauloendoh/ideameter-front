import { useMuiTheme } from "@/hooks/utils/useMuiTheme"
import { Button, Typography } from "@mui/material"
import React from "react"
import { MdOfflineBolt } from "react-icons/md"

type Props = {
  count: number
  youVoted: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  minWidth?: number
}

const HighImpactVoteButton = ({ ...props }: Props) => {
  const theme = useMuiTheme()
  return (
    <Button
      size="small"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        color: "unset",
        minWidth: props.minWidth,
      }}
      onClick={(e) => {
        if (props.onClick) {
          props.onClick(e)
        }
      }}
      disabled={props.onClick === undefined}
    >
      <MdOfflineBolt
        fontSize={18}
        style={{
          color: props.youVoted ? theme.palette.secondary.main : undefined,
        }}
      />
      <Typography
        style={{
          color: props.youVoted ? theme.palette.secondary.main : undefined,
        }}
      >
        {props.count}
      </Typography>
    </Button>
  )
}

export default HighImpactVoteButton
