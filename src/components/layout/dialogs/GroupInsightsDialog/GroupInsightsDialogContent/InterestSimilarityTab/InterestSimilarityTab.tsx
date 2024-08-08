import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useInterestSimilarityQuery from "@/types/domain/insights/useInterestSimilarityQuery"
import useMissingRatingsFromGroupQuery from "@/types/domain/insights/useMissingRatingsFromGroupQuery"
import { Box, Typography } from "@mui/material"

interface Props {
  groupId: string
}

const InterestSimilarityTab = (props: Props) => {
  const { data: similarities } = useInterestSimilarityQuery(props.groupId)
  const { data: missingRatings } = useMissingRatingsFromGroupQuery(
    props.groupId
  )
  const authUser = useAuthStore((s) => s.authUser)

  if (!similarities) return null
  return (
    <FlexCol sx={{ gap: 1 }}>
      <FlexVCenter sx={{ gap: 1 }}>
        <Box width="48px" />
        {similarities.map((similarity) => (
          <FlexVCenter
            width="64px"
            key={similarity.user.id}
            sx={{ justifyContent: "center" }}
          >
            <UserGroupAvatar
              groupId={props.groupId}
              userId={similarity.user.id}
            />
          </FlexVCenter>
        ))}
      </FlexVCenter>
      <FlexVCenter sx={{ gap: 1 }}>
        <Box width="48px">
          <UserGroupAvatar groupId={props.groupId} userId={authUser!.id} />
        </Box>
        {similarities.map((similarity) => (
          <FlexCol
            width="64px"
            key={similarity.user.id}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Box>{Math.floor(similarity.similarityPercentage * 100)}%</Box>
            <Typography variant="body2">
              {similarity.sameIdeasRatedCount} ideas
            </Typography>
          </FlexCol>
        ))}
      </FlexVCenter>
    </FlexCol>
  )
}

export default InterestSimilarityTab
