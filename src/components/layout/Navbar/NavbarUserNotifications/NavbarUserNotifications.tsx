import useHideNotificationDotsMutation from "@/hooks/react-query/domain/notifications/useHideNotificationDotsMutation"
import useNotificationsQuery from "@/hooks/react-query/domain/notifications/useNotificationsQuery"
import { useMySocketEvent } from "@/hooks/socket/useMySocketEvent"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { NotificationDto } from "@/types/domain/notification/NotificationDto"
import queryKeys from "@/utils/queryKeys"
import { wsEventNames } from "@/utils/wsEventNames"
import { Badge, IconButton, Menu } from "@mui/material"
import React, { useEffect, useMemo } from "react"
import { MdNotifications } from "react-icons/md"
import { useQueryClient } from "react-query"
import IdeaMentionNotificationItem from "./IdeaMentionNotificationItem/IdeaMentionNotificationItem"

const ariaName = `user-notifications-menu`

const NavbarUserNotifications = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const { data: notifications } = useNotificationsQuery(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (notifications && notifications.length > 0)
      setAnchorEl(event.currentTarget)
  }

  const { authUser } = useAuthStore()
  const { lastMessage: newNotification } = useMySocketEvent<NotificationDto>(
    wsEventNames.updateUserNotifications(authUser?.id || "")
  )
  const queryClient = useQueryClient()

  useEffect(() => {
    if (newNotification) {
      queryClient.invalidateQueries(queryKeys.notifications)
    }
  }, [newNotification])

  const {
    mutate: submitHideNotificationDots,
  } = useHideNotificationDotsMutation()

  const unseenNotificationCount = useMemo(
    () => notifications?.filter((n) => n.showDot).length || 0,
    [notifications]
  )

  const handleClose = () => {
    setAnchorEl(null)
    submitHideNotificationDots()
  }

  return (
    <div>
      <IconButton
        id={`${ariaName}-button`}
        aria-controls={open ? ariaName : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={unseenNotificationCount} color="primary">
          <MdNotifications />
        </Badge>
      </IconButton>

      <Menu
        id={ariaName}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": `${ariaName}-button`,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {/*  For now, we only have IdeaMentionNotificationItem */}
        {notifications?.map((notification) => (
          <IdeaMentionNotificationItem
            key={notification.id}
            notification={notification}
          />
        ))}
      </Menu>
    </div>
  )
}

export default NavbarUserNotifications
