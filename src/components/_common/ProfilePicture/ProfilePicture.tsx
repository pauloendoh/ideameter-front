import { Avatar } from "@mui/material";
import React, { FunctionComponent } from "react";

interface Props {
  pictureUrl: string;
  username: string;
  onClick?: () => void;
  size?: number | string;
  fontSize?: string;
}

const ProfilePicture: FunctionComponent<Props> = (props: Props) => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default ProfilePicture;
