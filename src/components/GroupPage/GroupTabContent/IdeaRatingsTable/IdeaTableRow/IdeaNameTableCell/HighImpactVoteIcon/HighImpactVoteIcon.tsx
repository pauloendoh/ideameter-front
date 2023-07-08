import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { Tooltip, Typography, useTheme } from "@mui/material"
import { deleteFromArray } from "endoh-utils"
import { useCallback, useMemo } from "react"
import UserGroupAvatar from "../../../UserTableCell/UserGroupAvatar/UserGroupAvatar"
import HighImpactVoteButton from "./HighImpactVoteButton/HighImpactVoteButton"

type Props = {
  ideaRating: IdeaRating
  groupId: string
}

const HighImpactVoteIcon = (props: Props) => {
  const theme = useTheme()

  const authUser = useAuthStore((s) => s.authUser)

  const { mutate: submitSaveIdea } = useSaveIdeaMutation()

  const youVotedHighImpact = useMemo(
    () =>
      Boolean(
        props.ideaRating.idea.highImpactVotes?.find(
          (v) => v.userId === authUser!.id
        )
      ),
    [props.ideaRating.idea.highImpactVotes, authUser]
  )

  const toggleHighImpactVote = useCallback(() => {
    if (!authUser || !props.ideaRating.idea.highImpactVotes) return

    const idea = { ...props.ideaRating.idea }

    if (!youVotedHighImpact) {
      idea.highImpactVotes = [
        ...idea.highImpactVotes,
        { ideaId: idea.id, userId: authUser.id },
      ]
      submitSaveIdea(idea)
      return
    }

    idea.highImpactVotes = deleteFromArray(
      idea.highImpactVotes,
      (v) => v.userId === authUser.id
    )
    submitSaveIdea(idea)
    return
  }, [props.ideaRating.idea.highImpactVotes, authUser, youVotedHighImpact])

  return (
    <Tooltip
      arrow
      title={
        <FlexCol gap={0.5}>
          <Typography>
            {props.ideaRating.idea.highImpactVotes.length} voted as high impact
          </Typography>
          <FlexVCenter gap={0.5}>
            {props.ideaRating.idea.highImpactVotes.map((vote) => (
              <UserGroupAvatar
                userId={vote.userId}
                groupId={props.groupId!}
                avatarProps={{
                  sx: { width: 24, height: 24, fontSize: 12 },
                }}
                key={vote.userId}
              />
            ))}
          </FlexVCenter>
        </FlexCol>
      }
    >
      {/* had to use div instead of FlexVCenter due to tooltip */}
      <HighImpactVoteButton
        count={props.ideaRating.idea.highImpactVotes.length}
        youVoted={youVotedHighImpact}
        onClick={(e) => {
          e.stopPropagation()
          toggleHighImpactVote()
        }}
      />
    </Tooltip>
  )
}

export default HighImpactVoteIcon
