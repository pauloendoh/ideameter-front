import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { NotificationDto } from "@/types/domain/notification/NotificationDto"
import { Avatar, Box, MenuItem, Typography, useTheme } from "@mui/material"
import { GoPrimitiveDot } from "react-icons/go"
import { format as formatTimeago } from "timeago.js"

interface Props {
  notification: NotificationDto
}

const IdeaMentionNotificationItem = ({ notification }: Props) => {
  const groupName =
    notification.ideaDescriptionMention!.idea.tab?.group?.name || ""

  const mentionByPictureUrl = notification.ideaDescriptionMention!.mentionBy
    .profile?.pictureUrl

  const mentionByUsername =
    notification.ideaDescriptionMention!.mentionBy.username || ""

  const theme = useTheme()

  return (
    <MenuItem>
      <FlexVCenter sx={{ gap: 2 }}>
        <Box position="relative">
          <Avatar src={mentionByPictureUrl}>{mentionByUsername[0]}</Avatar>

          <Avatar
            sx={{
              position: "absolute",
              width: 24,
              height: 24,
              bottom: -4,
              right: -4,

              fontSize: 14,
            }}
          >
            {groupName.substring(0, 2)}
          </Avatar>
        </Box>
        <FlexCol justifyContent="center" width={268}>
          <Typography>
            <b>{mentionByUsername}</b> mentioned you in an idea:
          </Typography>
          <Typography noWrap sx={{ fontStyle: "italic" }}>
            {notification.ideaDescriptionMention?.idea.name}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {formatTimeago(notification.createdAt)}
          </Typography>
        </FlexCol>
        <FlexVCenter sx={{ width: 24 }}>
          {notification.showDot && (
            <GoPrimitiveDot style={{ color: theme.palette.primary.main }} />
          )}
        </FlexVCenter>
      </FlexVCenter>
    </MenuItem>
  )
}

export default IdeaMentionNotificationItem
