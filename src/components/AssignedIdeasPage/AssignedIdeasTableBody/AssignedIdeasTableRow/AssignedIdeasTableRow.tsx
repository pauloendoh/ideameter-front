import HighImpactVoteButton from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/IdeaTableRow/IdeaNameTableCell/HighImpactVoteIcon/HighImpactVoteButton/HighImpactVoteButton"
import { useToggleHighImpactVote } from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/IdeaTableRow/IdeaNameTableCell/HighImpactVoteIcon/useToggleHighImpactVote/useToggleHighImpactVote"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import theme from "@/theme"
import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import urls from "@/utils/urls"
import {
  Box,
  IconButton,
  Link,
  TableCell,
  Tooltip,
  Typography,
} from "@mui/material"

import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import useHighImpactVotedByMeQuery from "@/hooks/react-query/domain/idea/useHighImpactVotedByMeQuery"
import useHighlyRatedIdeasByMeQuery from "@/hooks/react-query/domain/idea/useHighlyRatedIdeasByMeQuery"
import useRefreshRatingMutation from "@/hooks/react-query/domain/rating/useRefreshRatingMutation"
import NextLink from "next/link"
import { MdDelete, MdOutlineLowPriority } from "react-icons/md"
import { format } from "timeago.js"
import S from "../AssignedIdeasTableBody.styles"

type Props = {
  assignment: AssignedToMeDto
  showCompleted: boolean
  showVotedAt?: boolean
  index: number
  isHighlyRatedIdeasPage?: boolean
}

const AssignedIdeasTableRow = ({ ...props }: Props) => {
  const { getUserId } = useAuthStore()

  const ideaUrl = urls.pages.groupTabIdea(
    props.assignment.group.groupId,
    props.assignment.tab.tabId,
    props.assignment.idea.id
  )

  const myVote = props.assignment.idea.highImpactVotes.find(
    (v) => v.userId === getUserId()
  )

  const { refetch: refetchAssignedToMe } = useAssignedToMeQuery()
  const { refetch: refetchHighImpactVotedByMe } = useHighImpactVotedByMeQuery()
  const { refetch: refetchHighlyRated } = useHighlyRatedIdeasByMeQuery()
  const toggleHighImpactVote = useToggleHighImpactVote({
    idea: props.assignment.idea,
    onSuccess: () => {
      refetchAssignedToMe()
      refetchHighImpactVotedByMe()
    },
  })

  const { authUser } = useAuthStore()

  const { mutate } = useSaveIdeaMutation()
  const archiveIdea = () => {
    const idea = { ...props.assignment.idea }
    idea.isArchived = true

    mutate(idea, {
      onSuccess: () => {
        refetchAssignedToMe()
        refetchHighImpactVotedByMe()
        refetchHighlyRated()
      },
    })
  }

  const { mutate: refreshRating } = useRefreshRatingMutation()
  const reducePriority = () => {
    if (!props.assignment.myRating) {
      alert("You have not rated this idea yet.")
      return
    }

    refreshRating(props.assignment.myRating.id)
  }

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
            <FlexVCenter gap={1}>
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
              {props.assignment.iAmAssigned &&
                authUser?.profile?.pictureUrl && (
                  <img
                    src={authUser.profile.pictureUrl}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
            </FlexVCenter>
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
            {props.isHighlyRatedIdeasPage && (
              <FlexVCenter gap={1}>
                <Tooltip title="Archive">
                  <IconButton size="small" onClick={() => archiveIdea()}>
                    <MdDelete />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Reduce priority">
                  <IconButton size="small" onClick={() => reducePriority()}>
                    <MdOutlineLowPriority />
                  </IconButton>
                </Tooltip>
              </FlexVCenter>
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
            props.assignment.tab.tabId
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
