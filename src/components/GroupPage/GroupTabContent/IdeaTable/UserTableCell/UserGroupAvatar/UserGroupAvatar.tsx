import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import { Avatar, Tooltip, useTheme } from "@mui/material"
import React, { CSSProperties, useMemo } from "react"

interface Props {
  userId: string
  groupId: string
  widthAndHeight?: number
  onClick?: () => void
  selected?: boolean
  avatarProps?: React.ComponentPropsWithRef<typeof Avatar>
  status?: "online" | "away"
}

const UserGroupAvatar = (props: Props) => {
  const { data: groupMembers } = useGroupMembersQuery(props.groupId)

  const user = useMemo(() => {
    return groupMembers?.find((m) => m.userId === props.userId)?.user
  }, [groupMembers, props.userId])

  const theme = useTheme()

  const selectedStyles = useMemo(() => {
    return {
      boxSizing: "border-box",
      "-moz-box-sizing": "border-box",
      "-webkit-box-sizing": "border-box",
      border: props.selected
        ? `2px solid ${theme.palette.secondary.main}`
        : "none",
    } as CSSProperties
  }, [props.selected])

  return (
    <Tooltip title={user?.username ?? ""}>
      <div
        onClick={() => props.onClick?.()}
        style={{
          cursor: props.onClick ? "pointer" : "default",
          display: "flex",
          position: "relative",
        }}
      >
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
          <img
            src={user.profile.pictureUrl}
            alt={user.username}
            width={props.widthAndHeight || 40}
            height={props.widthAndHeight || 40}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              ...selectedStyles,
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
            style={{
              ...selectedStyles,
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
