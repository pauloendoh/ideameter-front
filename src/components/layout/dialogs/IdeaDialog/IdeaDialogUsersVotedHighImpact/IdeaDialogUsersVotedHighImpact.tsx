import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { HighImpactVoteDto } from "@/types/domain/high-impact-votes/HighImpactVoteDto"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import { Avatar, Box, Tooltip, Typography, useTheme } from "@mui/material"
import { useCallback, useMemo } from "react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { FaQuestionCircle } from "react-icons/fa"
import { MdOfflineBolt, MdOutlineAdd } from "react-icons/md"
import { RiCloseCircleFill } from "react-icons/ri"

interface Props {
  watch: UseFormWatch<IdeaDto>
  setValue: UseFormSetValue<IdeaDto>
}

const IdeaDialogUsersVotedHighImpact = ({ watch, setValue }: Props) => {
  const { groupId } = useRouterQueryString()
  const { data: groupMembers } = useGroupMembersQuery(groupId!)

  const { authUser } = useAuthStore()

  const getMember = useCallback(
    (userId: string) => {
      return groupMembers?.find((m) => m.userId === userId)?.user
    },
    [groupMembers, watch("highImpactVotes")]
  )

  const toggleUserVote = () => {
    const vote: HighImpactVoteDto = {
      ideaId: watch("id"),
      userId: authUser!.id,
    }

    const currVotes = watch("highImpactVotes")
    const newVotes = pushOrRemove(currVotes, vote, "userId")

    setValue("highImpactVotes", newVotes)
  }

  const youAlreadyVoted = useMemo(() => {
    const currVotes = watch("highImpactVotes")
    return Boolean(currVotes?.find((v) => v.userId === authUser!.id))
  }, [watch("highImpactVotes")])

  // show your vote first
  const sortedVotes = useMemo(() => {
    return watch("highImpactVotes").sort((a, b) =>
      a.userId === authUser?.id ? -1 : 1
    )
  }, [watch("highImpactVotes")])

  const theme = useTheme()

  return (
    <FlexCol gap={1}>
      <FlexVCenter
        gap={0.5}
        sx={{
          color: youAlreadyVoted ? theme.palette.secondary.main : undefined,
        }}
      >
        <MdOfflineBolt />
        <Typography>
          {watch("highImpactVotes").length} voted as quick return
        </Typography>
        <Tooltip title={"Members who feel this idea will be highly impactful"}>
          <div>
            <FaQuestionCircle
              style={{ color: theme.palette.grey[100], marginLeft: 16 }}
            />
          </div>
        </Tooltip>
      </FlexVCenter>

      <Flex gap={1}>
        {sortedVotes.map((vote) => (
          <Box position="relative" key={vote.userId}>
            <UserGroupAvatar groupId={groupId!} userId={vote.userId} />
            {vote.userId === authUser?.id && (
              <RiCloseCircleFill
                onClick={toggleUserVote}
                cursor="pointer"
                style={{
                  position: "absolute",
                  right: -6,
                  top: -6,
                  fontSize: 18,
                }}
              />
            )}
          </Box>
        ))}
        {!youAlreadyVoted && (
          <Avatar
            sx={{ cursor: "pointer", background: "LightGray" }}
            onClick={toggleUserVote}
          >
            <MdOutlineAdd />
          </Avatar>
        )}
        {/* <Avatar
          sx={{ cursor: "pointer", background: "LightGray" }}
          onClick={() =>
            openAssignDialog(watch("assignedUsers"), (newValues) =>
              setValue("assignedUsers", newValues)
            )
          }
        >
          <MdOutlineAdd />
        </Avatar> */}
      </Flex>
    </FlexCol>
  )
}

export default IdeaDialogUsersVotedHighImpact
