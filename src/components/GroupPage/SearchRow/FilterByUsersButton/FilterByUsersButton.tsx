import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton";
import Flex from "@/components/_common/flexboxes/Flex";
import UserAvatar from "@/components/_common/UserAvatar/UserAvatar";
import useIdeaAssignmentStore from "@/hooks/zustand/dialogs/useIdeaAssignmentStore";
import useGroupFilterStore from "@/hooks/zustand/domain/auth/group/useGroupFilterStore";
import { CgChevronDown } from "react-icons/cg";

interface Props {
  test?: string;
}

const FilterByUsersButton = (props: Props) => {
  const openAssignModal = useIdeaAssignmentStore((s) => s.openDialog);

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
            <UserAvatar user={user} widthHeight={24} fontSize={14} />
          ))}
      </Flex>
    </DarkButton>
  );
};

export default FilterByUsersButton;
