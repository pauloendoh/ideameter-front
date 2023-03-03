import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import { Avatar, Tooltip } from "@mui/material"
import Image from "next/image"
import React, { useMemo } from "react"

interface Props {
  userId: string
  groupId: string
  widthAndHeight?: number

  avatarProps?: React.ComponentPropsWithRef<typeof Avatar>
  status?: "online" | "away"
}

const UserGroupAvatar = (props: Props) => {
  const { data: groupMembers } = useGroupMembersQuery(props.groupId)

  const user = useMemo(() => {
    return groupMembers?.find((m) => m.userId === props.userId)?.user
  }, [groupMembers, props.userId])

  return (
    <Tooltip title={user?.username || ""}>
      <div style={{ display: "flex", position: "relative" }}>
        {props.status && (
          <div
            style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: props.status === "online" ? "green" : "orange",
              border: "1px solid white",
              zIndex: 1,
            }}
            title={props.status === "online" ? "Online" : "Away"}
          />
        )}
        {user?.profile?.pictureUrl ? (
          <Image
            src={user.profile.pictureUrl}
            alt={user.username}
            width={props.widthAndHeight || 40}
            height={props.widthAndHeight || 40}
            objectFit="cover"
            style={{
              borderRadius: "50%",
            }}
          />
        ) : (
          <Avatar
            src={user?.profile?.pictureUrl}
            alt={user?.username}
            {...props.avatarProps}
            sx={{
              width: props.widthAndHeight || 40,
              height: props.widthAndHeight || 40,
              ...(props.avatarProps?.sx || {}),
            }}
          >
            {user?.username[0]?.toUpperCase()}
          </Avatar>
        )}
      </div>
    </Tooltip>
  )
}

export default UserGroupAvatar
