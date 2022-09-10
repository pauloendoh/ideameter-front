import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/UserTableCell/UserGroupAvatar/UserGroupAvatar";
import Flex from "@/components/_common/flexboxes/Flex";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery";
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { Typography } from "@mui/material";
import { useCallback } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface Props {
  watch: UseFormWatch<IdeaDto>;
  setValue: UseFormSetValue<IdeaDto>;
}

const IdeaDialogUsersVotedHighImpact = ({ watch, setValue }: Props) => {
  const { groupId } = useRouterQueryString();
  const { data: groupMembers } = useGroupMembersQuery(groupId!);

  const getMember = useCallback(
    (userId: string) => {
      return groupMembers?.find((m) => m.userId === userId)?.user;
    },
    [groupMembers, watch("highImpactVotes")]
  );

  return (
    <FlexCol gap={1}>
      <Typography>High impact</Typography>
      <Flex gap={1}>
        {watch("highImpactVotes").map((vote) => (
          <UserGroupAvatar
            key={vote.userId}
            groupId={groupId!}
            userId={vote.userId}
          />
        ))}
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
  );
};

export default IdeaDialogUsersVotedHighImpact;
