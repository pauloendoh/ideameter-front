import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useMissingRatingsFromGroupQuery from "@/types/domain/insights/useMissingRatingsFromGroupQuery"
import { Badge } from "@mui/material"

interface Props {
  groupId: string
}

const MissingRatingsTab = (props: Props) => {
  const { data: missingRatings } = useMissingRatingsFromGroupQuery(
    props.groupId
  )

  if (!missingRatings) return null
  return (
    <FlexCol sx={{ gap: 1 }}>
      <FlexVCenter sx={{ gap: 1 }}>
        {missingRatings.map((item) => (
          <Badge key={item.id} badgeContent={item.count} color="primary">
            <UserGroupAvatar groupId={props.groupId} userId={item.id} />
          </Badge>
        ))}
      </FlexVCenter>
    </FlexCol>
  )
}

export default MissingRatingsTab
