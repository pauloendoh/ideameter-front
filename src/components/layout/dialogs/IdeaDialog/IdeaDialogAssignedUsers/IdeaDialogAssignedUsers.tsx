import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useIdeaAssignmentStore from "@/hooks/zustand/dialogs/useIdeaAssignmentStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { Avatar, Box, Tooltip, Typography } from "@mui/material"
import { useMemo } from "react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { FaUserAlt } from "react-icons/fa"
import { MdOutlineAdd, MdWarning } from "react-icons/md"

interface Props {
  // PE 1/3 - rename to "values" or "idea"
  watch: UseFormWatch<IdeaDto>
  setValue: UseFormSetValue<IdeaDto>
}

const IdeaDialogAssignedUsers = ({ watch, setValue }: Props) => {
  const openAssignDialog = useIdeaAssignmentStore((s) => s.openDialog)
  const { groupId } = useRouterQueryString()

  const showAlert = useMemo(() => {
    return watch("assignedUsers").length === 0 && watch("isDone")
  }, [watch("assignedUsers"), watch("isDone")])

  return (
    <FlexCol gap={1}>
      <FlexVCenter
        gap={1}
        sx={(theme) => ({
          color: showAlert ? theme.palette.error.main : undefined,
        })}
      >
        <FaUserAlt />
        <Typography>Assigned</Typography>
        {showAlert && (
          <Tooltip
            title="Please assign at least one user before completing"
            arrow
          >
            <Box
              sx={{
                position: "relative",
                top: 2,
                left: -2,
              }}
            >
              <MdWarning />
            </Box>
          </Tooltip>
        )}
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
