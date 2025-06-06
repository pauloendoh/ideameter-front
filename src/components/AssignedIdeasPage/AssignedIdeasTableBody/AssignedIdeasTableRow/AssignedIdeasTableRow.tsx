import HighImpactVoteButton from "@/components/GroupPage/GroupTabContent/IdeaTable/IdeaTableRow/IdeaNameTableCell/HighImpactVoteButtonWithTooltip/HighImpactVoteButton/HighImpactVoteButton"
import { useToggleHighImpactVote } from "@/components/GroupPage/GroupTabContent/IdeaTable/IdeaTableRow/IdeaNameTableCell/HighImpactVoteButtonWithTooltip/useToggleHighImpactVote/useToggleHighImpactVote"
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
import { Flex } from "@mantine/core"
import NextLink from "next/link"
import { MdDelete, MdOutlineLowPriority } from "react-icons/md"
import { PiTabs } from "react-icons/pi"
import { format } from "timeago.js"
import S from "../AssignedIdeasTableBody.styles"
import { calculateIdeaResult } from "./calculateIdeaResult/calculateIdeaResult"

type Props = {
  ideaAssignment: AssignedToMeDto
  showCompleted: boolean
  showVotedAt?: boolean
  index: number
  isHighlyRatedIdeasPage?: boolean
  onOpenNext20?: () => void
}

const AssignedIdeasTableRow = ({ ...props }: Props) => {
  const { getAuthUserId: getUserId } = useAuthStore()

  const ideaUrl = urls.pages.groupTabIdea(
    props.ideaAssignment.group.groupId,
    props.ideaAssignment.tab.tabId,
    props.ideaAssignment.idea.id
  )

  const myHighImpactVote = props.ideaAssignment.idea.highImpactVotes.find(
    (v) => v.userId === getUserId()
  )

  const { refetch: refetchAssignedToMe } = useAssignedToMeQuery()
  const { refetch: refetchHighImpactVotedByMe } = useHighImpactVotedByMeQuery()
  const { refetch: refetchHighlyRated } = useHighlyRatedIdeasByMeQuery()
  const toggleHighImpactVote = useToggleHighImpactVote({
    idea: props.ideaAssignment.idea,
    onSuccess: () => {
      refetchAssignedToMe()
      refetchHighImpactVotedByMe()
    },
  })

  const { authUser } = useAuthStore()

  const { mutate } = useSaveIdeaMutation()
  const archiveIdea = () => {
    const idea = { ...props.ideaAssignment.idea }
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
    if (!props.ideaAssignment.myRating) {
      alert("You have not rated this idea yet.")
      return
    }

    refreshRating(props.ideaAssignment.myRating.id)
  }

  return (
    <S.TableRow
      id={props.ideaAssignment.idea.id}
      key={props.ideaAssignment.idea.id}
      className="idea-table-row"
      hover
      style={{
        backgroundColor:
          props.ideaAssignment.idea.hasChangedRewardingOrDiscomfort === false
            ? theme.palette.grey[900]
            : "transparent",
      }}
    >
      <TableCell align="center">{props.index + 1}</TableCell>
      <TableCell>
        <FlexCol gap={0.5}>
          <NextLink href={ideaUrl} passHref>
            <Link
              color={theme.palette.grey[100]}
              width="fit-content"
              target="_blank"
            >
              {props.ideaAssignment.idea.name}
            </Link>
          </NextLink>
          {props.ideaAssignment.idea.labels?.length > 0 && (
            <Flex
              sx={{
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {props.ideaAssignment.idea?.labels.map((label) => (
                <FlexVCenter
                  key={label.id}
                  sx={{
                    backgroundColor: label.bgColor,
                    borderRadius: 1,
                    padding: "2px 8px",
                  }}
                >
                  {label.name}
                </FlexVCenter>
              ))}
            </Flex>
          )}
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
                  count={props.ideaAssignment.idea.highImpactVotes.length}
                  youVoted={props.ideaAssignment.idea.highImpactVotes.some(
                    (v) => v.userId === getUserId()
                  )}
                />
              </Box>
              {props.ideaAssignment.iAmAssigned &&
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
            {props.showVotedAt && myHighImpactVote?.createdAt && (
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                }}
              >
                Voted {format(myHighImpactVote.createdAt)}
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
      {props.isHighlyRatedIdeasPage && (
        <>
          <TableCell align="center">
            {calculateIdeaResult(props.ideaAssignment.idea)}
          </TableCell>

          <TableCell align="center">
            {props.ideaAssignment.idea.rewarding}
          </TableCell>
          <TableCell align="center">
            {props.ideaAssignment.idea.discomfortZone}
          </TableCell>
        </>
      )}
      <TableCell>
        <NextLink
          href={urls.pages.groupId(props.ideaAssignment.group.groupId)}
          passHref
        >
          <Link color={theme.palette.grey[100]}>
            {" "}
            {props.ideaAssignment.group.name}
          </Link>
        </NextLink>
      </TableCell>
      <TableCell>
        <NextLink
          href={urls.pages.groupTab(
            props.ideaAssignment.group.groupId,
            props.ideaAssignment.tab.tabId
          )}
          passHref
        >
          <Link color={theme.palette.grey[100]}>
            {" "}
            {props.ideaAssignment.tab.name}
          </Link>
        </NextLink>
        {props.isHighlyRatedIdeasPage && (
          <Tooltip title={"Open next 20 from this tab."} sx={{ ml: 1 }}>
            <IconButton size="small" onClick={() => props.onOpenNext20?.()}>
              <PiTabs />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    </S.TableRow>
  )
}

export default AssignedIdeasTableRow
