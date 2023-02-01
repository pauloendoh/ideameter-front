import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import { Avatar, Tooltip } from "@mui/material"
import Image from "next/image"
import React, { useMemo } from "react"

interface Props {
  userId: string
  groupId: string
  avatarProps?: React.ComponentPropsWithRef<typeof Avatar>
  imageProps?: React.ComponentPropsWithRef<typeof Image>
}

const UserGroupAvatar = (props: Props) => {
  const { data: groupMembers } = useGroupMembersQuery(props.groupId)

  const user = useMemo(() => {
    return groupMembers?.find((m) => m.userId === props.userId)?.user
  }, [groupMembers, props.userId])

  return (
    <Tooltip title={user?.username || ""}>
      {user?.profile?.pictureUrl ? (
        <Image
          src={user.profile.pictureUrl}
          alt={user.username}
          width={40}
          height={40}
          objectFit="cover"
          style={{
            borderRadius: 40,
          }}
          {...props.imageProps}
        />
      ) : (
        <Avatar
          src={user?.profile?.pictureUrl}
          alt={user?.username}
          {...props.avatarProps}
        >
          {user?.username[0]?.toUpperCase()}
        </Avatar>
      )}
    </Tooltip>
  )
}

export default UserGroupAvatar
