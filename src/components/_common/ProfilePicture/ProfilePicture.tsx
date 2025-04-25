import { Avatar } from "@mui/material"
import { FunctionComponent } from "react"

interface Props {
  pictureUrl: string
  username: string
  onClick?: () => void
  size?: number | string
}

const ProfilePicture: FunctionComponent<Props> = (props: Props) => {
  return (
    <Avatar
      src={props.pictureUrl}
      alt={props.username}
      onClick={props.onClick}
      style={{
        width: props.size,
        height: props.size,
        cursor: props.onClick ? "pointer" : "inherit",
      }}
    />
  )
}

export default ProfilePicture
