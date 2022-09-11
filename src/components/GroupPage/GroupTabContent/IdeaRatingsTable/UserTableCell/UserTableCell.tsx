import FlexHCenter from "@/components/_common/flexboxes/FlexHCenter";
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery";
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import { TableCell } from "@mui/material";
import { useMemo } from "react";
import UserGroupAvatar from "./UserGroupAvatar/UserGroupAvatar";

interface Props {
  isYou?: boolean;

  userId: string;
}

const UserTableCell = (props: Props) => {
  const { groupId } = useRouterQueryString();
  const { data: groupMembers } = useGroupMembersQuery(groupId);

  const user = useMemo(() => {
    if (!groupMembers || groupMembers.length === 0) return null;

    return groupMembers.find((m) => m.userId === props.userId)?.user;
  }, [groupMembers, props.userId]);

  return (
    <TableCell key={props.userId} align="center" width="75px">
      {groupId && user && (
        <FlexHCenter>
          <UserGroupAvatar groupId={groupId} userId={user.id} />
        </FlexHCenter>
      )}
    </TableCell>
  );
};

export default UserTableCell;
