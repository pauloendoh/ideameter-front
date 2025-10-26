import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import {
  CircularProgress,
  DialogContent,
  List,
  Typography,
  useTheme,
} from "@mui/material"
import AddMemberButton from "./AddMemberButton/AddMemberButton"
import GroupDialogMemberItem from "./GroupDialogMemberItem/GroupDialogMemberItem"

interface Props {
  groupId: string
}

const GroupMembers = (props: Props) => {
  const { authUser } = useAuthStore()
  const { data: members } = useGroupMembersQuery(props.groupId)
  const theme = useTheme()
  return (
    <DialogContent sx={{ pt: 2 }}>
      <FlexVCenter pb={2}>
        <hr style={{ width: "100%", borderColor: theme.palette.grey[700] }} />
      </FlexVCenter>
      <Typography variant="h6">Group members</Typography>
      <FlexCol mt={2} gap={2}>
        <AddMemberButton groupId={props.groupId} />

        <List>
          {!members ? (
            <CircularProgress />
          ) : (
            <>
              {members.map((userGroup) => (
                <GroupDialogMemberItem
                  key={userGroup.userId}
                  groupId={props.groupId}
                  userGroup={userGroup}
                />
              ))}
            </>
          )}
        </List>
      </FlexCol>
    </DialogContent>
  )
}

export default GroupMembers
