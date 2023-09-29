import HighImpactVoteButton from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/IdeaTableRow/IdeaNameTableCell/HighImpactVoteIcon/HighImpactVoteButton/HighImpactVoteButton"
import { useToggleHighImpactVote } from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/IdeaTableRow/IdeaNameTableCell/HighImpactVoteIcon/useToggleHighImpactVote/useToggleHighImpactVote"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import theme from "@/theme"
import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import urls from "@/utils/urls"
import { Box, Link, TableCell, Typography } from "@mui/material"

import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import useHighImpactVotedByMeQuery from "@/hooks/react-query/domain/idea/useHighImpactVotedByMeQuery"
import NextLink from "next/link"
import { format } from "timeago.js"
import S from "../AssignedIdeasTableBody.styles"

type Props = {
  assignment: AssignedToMeDto
  showCompleted: boolean
  showVotedAt?: boolean
  index: number
}

const AssignedIdeasTableRow = ({ ...props }: Props) => {
  const { getUserId } = useAuthStore()

  const ideaUrl = urls.pages.groupTabIdea(
    props.assignment.group.groupId,
    props.assignment.tab.id,
    props.assignment.idea.id
  )

  const myVote = props.assignment.idea.highImpactVotes.find(
    (v) => v.userId === getUserId()
  )

  const { refetch: refetchAssignedToMe } = useAssignedToMeQuery()
  const { refetch: refetchHighImpactVotedByMe } = useHighImpactVotedByMeQuery()
  const toggleHighImpactVote = useToggleHighImpactVote({
    idea: props.assignment.idea,
    onSuccess: () => {
      refetchAssignedToMe()
      refetchHighImpactVotedByMe()
    },
  })

  return (
    <S.TableRow
      id={props.assignment.idea.id}
      key={props.assignment.idea.id}
      className="idea-table-row"
      hover
    >
      <TableCell align="center">{props.index + 1}</TableCell>
      <TableCell>
        <FlexCol gap={0.5}>
          <NextLink href={ideaUrl} passHref>
            <Link color={theme.palette.grey[100]} width="fit-content">
              {props.assignment.idea.name}
            </Link>
          </NextLink>
          <FlexVCenter justifyContent={"space-between"}>
            <Box
              sx={{
                cursor: "pointer",
              }}
              onClick={() => toggleHighImpactVote()}
            >
              <HighImpactVoteButton
                minWidth={0}
                count={props.assignment.idea.highImpactVotes.length}
                youVoted={props.assignment.idea.highImpactVotes.some(
                  (v) => v.userId === getUserId()
                )}
              />
            </Box>
            {props.showVotedAt && myVote?.createdAt && (
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                }}
              >
                Voted {format(myVote.createdAt)}
              </Typography>
            )}
          </FlexVCenter>
        </FlexCol>
      </TableCell>
      <TableCell>
        <NextLink
          href={urls.pages.groupId(props.assignment.group.groupId)}
          passHref
        >
          <Link color={theme.palette.grey[100]}>
            {" "}
            {props.assignment.group.name}
          </Link>
        </NextLink>
      </TableCell>
      <TableCell>
        <NextLink
          href={urls.pages.groupTab(
            props.assignment.group.groupId,
            props.assignment.tab.id
          )}
          passHref
        >
          <Link color={theme.palette.grey[100]}>
            {" "}
            {props.assignment.tab.name}
          </Link>
        </NextLink>
      </TableCell>
    </S.TableRow>
  )
}

export default AssignedIdeasTableRow
