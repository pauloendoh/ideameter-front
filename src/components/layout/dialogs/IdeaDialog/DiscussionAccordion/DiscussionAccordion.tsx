import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
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
import { useMemo, useRef, useState } from "react"
import { MdExpandMore } from "react-icons/md"
import CommentInput from "./CommentInput/CommentInput"
import UserComment from "./UserComment/UserComment"

interface Props {
  ideaId: string
}

const ariaLabel = `discussion-accordion`

const DiscussionAccordion = (props: Props) => {
  const [expanded, setExpanded] = useState(true)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const saveButtonRef = useRef<HTMLButtonElement>(null)

  const theme = useTheme()

  const { groupId } = useRouterQueryString()

  const { authUser } = useAuthStore()

  const { data: comments } = useIdeaCommentsQuery(props.ideaId)

  const sortedComments = useMemo(() => {
    return (
      comments?.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }) || []
    )
  }, [comments])

  const accordionLabel = useMemo(() => {
    if (sortedComments.length === 0) return "Discussion · 0 comments"
    if (sortedComments.length === 1) return "Discussion · 1 comment"
    return `Discussion · ${sortedComments.length} comments`
  }, [sortedComments.length])

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
        onClick={() => {
          setExpanded(!expanded)

          if (!expanded) {
            setTimeout(() => {
              saveButtonRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
              })
            }, 250)
          }
        }}
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
        <Typography>{accordionLabel}</Typography>
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

              <CommentInput
                inputRef={inputRef}
                saveButtonRef={saveButtonRef}
                ideaId={props.ideaId}
              />
            </Flex>

            <FlexCol gap={4} mt={4}>
              {sortedComments.map((comment) => (
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
