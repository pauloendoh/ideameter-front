import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery";
import { Avatar, Tooltip } from "@mui/material";
import React, { useMemo } from "react";

interface Props {
  userId: string;
  groupId: string;
  avatarProps?: React.ComponentPropsWithRef<typeof Avatar>;
}

const UserGroupAvatar = (props: Props) => {
  const { data: groupMembers } = useGroupMembersQuery(props.groupId);

  const user = useMemo(() => {
    return groupMembers?.find((m) => m.userId === props.userId)?.user;
  }, [groupMembers, props.userId]);

  return (
    <Tooltip title={user?.username || ""}>
      <Avatar
        src={user?.profile.pictureUrl}
        alt={user?.username}
        {...props.avatarProps}
      >
        {user?.username[0]?.toUpperCase()}
      </Avatar>
    </Tooltip>
  );
};

export default UserGroupAvatar;
