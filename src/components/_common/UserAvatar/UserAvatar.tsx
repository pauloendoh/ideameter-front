import SimpleUserDto from "@/types/domain/user/SimpleUserDto";
import { Avatar } from "@mui/material";

interface Props {
  user: SimpleUserDto;
  widthHeight?: number;
  fontSize?: number;
}

const UserAvatar = (props: Props) => {
  return (
    <Avatar
      sx={{
        width: props.widthHeight,
        height: props.widthHeight,
        fontSize: props.fontSize,
      }}
    >
      {props.user.username[0].toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;
