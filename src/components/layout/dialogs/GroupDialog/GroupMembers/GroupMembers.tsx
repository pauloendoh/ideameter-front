import FlexCol from "@/components/_common/flexboxes/FlexCol";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery";
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import { Avatar, DialogContent, Typography } from "@mui/material";
import React from "react";
import AddMemberButton from "./AddMemberButton/AddMemberButton";

interface Props {
  groupId: string;
}

const GroupMembers = (props: Props) => {
  const { authUser } = useAuthStore();
  const { data: members } = useGroupMembersQuery(props.groupId);
  return (
    <DialogContent sx={{ pt: 2 }}>
      <FlexVCenter pb={2}>
        <hr style={{ width: "100%" }} />
      </FlexVCenter>
      <Typography variant="h6">Group members</Typography>
      <FlexCol mt={2} gap={2}>
        <AddMemberButton groupId={props.groupId} />

        {members &&
          members.map((member, index) => (
            <FlexVCenter key={index} sx={{ gap: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32, fontSize: 20 }}>
                {member.user.username[0].toUpperCase()}
              </Avatar>
              <Typography>
                {authUser && authUser.id === member.user.id
                  ? "You"
                  : member.user.username}
              </Typography>
            </FlexVCenter>
          ))}
      </FlexCol>
    </DialogContent>
  );
};

export default GroupMembers;
