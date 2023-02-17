import FlexHCenter from "@/components/_common/flexboxes/FlexHCenter"
import useGroupMembersLastOnlineQuery from "@/hooks/react-query/domain/group-members/useGroupMembersLastOnlineQuery"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { TableCell } from "@mui/material"
import { useMemo } from "react"
import UserGroupAvatar from "./UserGroupAvatar/UserGroupAvatar"

interface Props {
  isYou?: boolean

  userId: string
}

const UserTableCell = (props: Props) => {
  const { groupId } = useRouterQueryString()
  const { data: groupMembers } = useGroupMembersQuery(groupId)

  const user = useMemo(() => {
    if (!groupMembers || groupMembers.length === 0) return null

    return groupMembers.find((m) => m.userId === props.userId)?.user
  }, [groupMembers, props.userId])

  const { authUser } = useAuthStore()

  const { data: lastOnlineData } = useGroupMembersLastOnlineQuery(
    groupId,
    authUser?.id
  )

  const isOnline = useMemo(() => {
    const user = lastOnlineData?.find((u) => u.userId === props.userId)
    if (!user) return false

    // check last 30 seconds
    const lastOnline = new Date(user.lastOnlineAt)
    const now = new Date()
    const diff = now.getTime() - lastOnline.getTime()
    const diffSeconds = diff / 1000
    if (diffSeconds < 30) return true
  }, [lastOnlineData])

  return (
    <TableCell key={props.userId} align="center" width="75px">
      {groupId && user && (
        <FlexHCenter>
          <UserGroupAvatar
            groupId={groupId}
            userId={user.id}
            isOnline={isOnline}
          />
        </FlexHCenter>
      )}
    </TableCell>
  )
}

export default UserTableCell
