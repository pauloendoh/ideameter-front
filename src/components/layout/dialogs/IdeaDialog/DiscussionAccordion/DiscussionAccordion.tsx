import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import useIdeaCommentsQuery from "@/hooks/react-query/domain/comment/useIdeaCommentsQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { Flex } from "@mantine/core"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  useTheme,
} from "@mui/material"
import { useState } from "react"
import { MdExpandMore } from "react-icons/md"
import CommentInput from "./CommentInput/CommentInput"
import UserComment from "./UserComment/UserComment"

interface Props {
  ideaId: string
}

const ariaLabel = `discussion-accordion`

const DiscussionAccordion = (props: Props) => {
  const [expanded, setExpanded] = useState(true)

  const theme = useTheme()

  const [isAddingComment, setIsAddingComment] = useState(false)

  const { groupId } = useRouterQueryString()

  const { authUser } = useAuthStore()

  const { data: comments } = useIdeaCommentsQuery(props.ideaId)

  return (
    <Accordion
      expanded={expanded}
      sx={{
        "&.MuiAccordion-root": {
          background: "transparent",
          boxShadow: "none",
          borderTop: `1px solid ${theme.palette.grey[700]}`,
          mb: 0,
        },
        ".MuiAccordionSummary-root": {
          minHeight: "unset",
          px: 0,
        },
      }}
    >
      <AccordionSummary
        onClick={() => setExpanded(!expanded)}
        expandIcon={<MdExpandMore />}
        aria-controls={`${ariaLabel}-head`}
        id={`${ariaLabel}-head`}
        sx={{
          flexDirection: "row-reverse",
          gap: 1,
          minHeight: "unset !important",
          ".MuiAccordionSummary-content": {
            margin: "12px 0 8px !important",
          },
        }}
      >
        <Typography>Discussion</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pb: 0 }}>
        <Grid
          container
          sx={{
            mt: 2,
          }}
        >
          <Grid item xs={8}>
            <Flex gap={8}>
              <div>
                <UserGroupAvatar groupId={groupId} userId={authUser?.id!} />
              </div>
              {isAddingComment ? (
                <CommentInput
                  ideaId={props.ideaId}
                  onClose={() => setIsAddingComment(false)}
                />
              ) : (
                <Box
                  sx={{
                    cursor: "text",
                    borderRadius: 1,
                    width: "100%",
                    minHeight: 80,
                    p: 1,
                    border: `1px solid ${theme.palette.grey[700]}`,
                    fontStyle: "italic",
                    color: theme.palette.grey[500],
                    background: theme.palette.grey[900],
                  }}
                  onClick={() => setIsAddingComment(true)}
                >
                  Add a comment
                </Box>
              )}
            </Flex>

            <FlexCol gap={4} mt={4}>
              {comments?.map((comment) => (
                <UserComment
                  key={comment.id}
                  comment={comment}
                  groupId={groupId!}
                />
              ))}
            </FlexCol>
            <Box height={40} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}

export default DiscussionAccordion
