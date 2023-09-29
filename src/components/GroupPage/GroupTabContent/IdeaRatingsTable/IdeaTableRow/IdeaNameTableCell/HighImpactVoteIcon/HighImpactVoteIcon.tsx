import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { Tooltip, Typography } from "@mui/material"
import { useMemo } from "react"
import UserGroupAvatar from "../../../UserTableCell/UserGroupAvatar/UserGroupAvatar"
import HighImpactVoteButton from "./HighImpactVoteButton/HighImpactVoteButton"
import { useToggleHighImpactVote } from "./useToggleHighImpactVote/useToggleHighImpactVote"

type Props = {
  ideaRating: IdeaRating
  groupId: string
}

// PE 1/3 - what's the difference with HighImpactVoteButton  ?
const HighImpactVoteIcon = (props: Props) => {
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

  const toggleHighImpactVote = useToggleHighImpactVote({
    idea: props.ideaRating.idea,
  })

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
