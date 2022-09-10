import Flex from "@/components/_common/flexboxes/Flex";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import useIdeaAssignmentStore from "@/hooks/zustand/dialogs/useIdeaAssignmentStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { Avatar, Typography } from "@mui/material";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { MdOutlineAdd } from "react-icons/md";

interface Props {
  watch: UseFormWatch<IdeaDto>;
  setValue: UseFormSetValue<IdeaDto>;
}

const IdeaDialogAssignedUsers = ({ watch, setValue }: Props) => {
  const openAssignDialog = useIdeaAssignmentStore((s) => s.openDialog);

  return (
    <FlexCol gap={1}>
      <Typography>Assigned</Typography>
      <Flex gap={1}>
        {watch("assignedUsers").map((user) => (
          <Avatar key={user.id}>{user.username[0].toUpperCase()}</Avatar>
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
  );
};

export default IdeaDialogAssignedUsers;
