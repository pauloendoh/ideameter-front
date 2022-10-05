import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useIdeaAssignmentStore from "@/hooks/zustand/dialogs/useIdeaAssignmentStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { Avatar, Typography } from "@mui/material"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { FaUserAlt } from "react-icons/fa"
import { MdOutlineAdd } from "react-icons/md"

interface Props {
  watch: UseFormWatch<IdeaDto>
  setValue: UseFormSetValue<IdeaDto>
}

const IdeaDialogAssignedUsers = ({ watch, setValue }: Props) => {
  const openAssignDialog = useIdeaAssignmentStore((s) => s.openDialog)
  const { groupId } = useRouterQueryString()
  return (
    <FlexCol gap={1}>
      <FlexVCenter gap={1}>
        <FaUserAlt />
        <Typography>Assigned</Typography>
      </FlexVCenter>
      <Flex gap={1}>
        {watch("assignedUsers").map((user) => (
          <UserGroupAvatar key={user.id} userId={user.id} groupId={groupId!} />
        ))}
        <Avatar
          sx={{ cursor: "pointer", background: "LightGray" }}
          onClick={() =>
            openAssignDialog(watch("assignedUsers"), (newValues) =>
              setValue("assignedUsers", newValues)
            )
          }
        >
          <MdOutlineAdd />
        </Avatar>
      </Flex>
    </FlexCol>
  )
}

export default IdeaDialogAssignedUsers
