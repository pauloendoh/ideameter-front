import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import Flex from "@/components/_common/flexboxes/Flex"
import { useToggleFilterMeHotkey } from "@/hooks/hotkeys/useToggleFilterMeHotkey/useToggleFilterMeHotkey"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useIdeaAssignmentStore from "@/hooks/zustand/dialogs/useIdeaAssignmentStore"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import { useTheme } from "@mui/material"
import { CgChevronDown } from "react-icons/cg"
import UserGroupAvatar from "../../GroupTabContent/IdeaTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"

interface Props {
  test?: string
}

const AssignedUsersButton = (props: Props) => {
  const openAssignModal = useIdeaAssignmentStore((s) => s.openDialog)
  const { groupId, tabId } = useRouterQueryString()
  const { filter, changeFilterUsers } = useGroupFilterStore()

  useToggleFilterMeHotkey()
  const theme = useTheme()

  return (
    <DarkButton
      sx={{
        background:
          filter.users.length > 0 ? theme.palette.secondary.main : undefined,
        ":hover": {
          background:
            filter.users.length > 0 ? theme.palette.secondary.main : undefined,
        },
      }}
      endIcon={<CgChevronDown />}
      onClick={() => {
        openAssignModal(filter.users, (newValue) =>
          changeFilterUsers(newValue, tabId)
        )
      }}
    >
      <Flex gap={1}>
        Assigned to{" "}
        {filter.users.length > 0 &&
          filter.users.map((user) => (
            <UserGroupAvatar
              key={user.id}
              userId={user.id}
              groupId={groupId!}
              avatarProps={{
                sx: {
                  width: 24,
                  height: 24,
                  fontSize: 14,
                },
              }}
              widthAndHeight={24}
            />
          ))}
      </Flex>
    </DarkButton>
  )
}

export default AssignedUsersButton
