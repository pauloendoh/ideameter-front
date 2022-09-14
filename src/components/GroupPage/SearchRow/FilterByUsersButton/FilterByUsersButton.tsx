import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton";
import Flex from "@/components/_common/flexboxes/Flex";
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import useIdeaAssignmentStore from "@/hooks/zustand/dialogs/useIdeaAssignmentStore";
import useGroupFilterStore from "@/hooks/zustand/domain/auth/group/useGroupFilterStore";
import { CgChevronDown } from "react-icons/cg";
import UserGroupAvatar from "../../GroupTabContent/IdeaRatingsTable/UserTableCell/UserGroupAvatar/UserGroupAvatar";

interface Props {
  test?: string;
}

// PE 1/3 - melhorar nome?
const FilterByUsersButton = (props: Props) => {
  const openAssignModal = useIdeaAssignmentStore((s) => s.openDialog);
  const { groupId } = useRouterQueryString();
  const [filter, changeUserIds] = useGroupFilterStore((s) => [
    s.filter,
    s.changeFilterUsers,
  ]);

  return (
    <DarkButton
      endIcon={<CgChevronDown />}
      onClick={() => {
        openAssignModal(filter.users, (newValue) => changeUserIds(newValue));
      }}
    >
      <Flex gap={1}>
        Assigned to{" "}
        {filter.users.length > 0 &&
          filter.users.map((user) => (
            <UserGroupAvatar
              userId={user.id}
              groupId={groupId!}
              avatarProps={{
                sx: {
                  width: 24,
                  height: 24,
                  fontSize: 14,
                },
              }}
            />
          ))}
      </Flex>
    </DarkButton>
  );
};

export default FilterByUsersButton;
