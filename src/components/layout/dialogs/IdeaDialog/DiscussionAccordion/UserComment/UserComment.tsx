import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import Flex from "@/components/_common/flexboxes/Flex"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { CommentDto } from "@/hooks/react-query/domain/comment/types/CommentDto"
import { Box, Typography, useTheme } from "@mui/material"
import { format } from "timeago.js"

type Props = {
  comment: CommentDto
  groupId: string
}

const UserComment = (props: Props) => {
  const theme = useTheme()
  return (
    <Flex gap={1}>
      <div>
        <UserGroupAvatar
          groupId={props.groupId}
          userId={props.comment.user?.id!}
        />
      </div>

      <Box width="100%">
        <FlexVCenter gap={1}>
          <Typography
            sx={{
              fontWeight: 500,
            }}
          >
            {props.comment.user?.username}
          </Typography>
          ·
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.grey[500],
            }}
          >
            {format(props.comment.updatedAt)}
          </Typography>
        </FlexVCenter>
        <Box
          mt={1}
          sx={{
            borderRadius: 1,
            width: "100%",
            p: 1,
            minHeight: 40,
            border: `1px solid ${theme.palette.grey[700]}`,
          }}
        >
          {props.comment.text}
        </Box>
      </Box>
    </Flex>
  )
}

export default UserComment
