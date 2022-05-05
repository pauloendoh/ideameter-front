import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import { useMemo } from "react";
import useGroupMembersQuery from "./useGroupMembersQuery";

const useOtherMembersQueryUtils = (groupId: string) => {
  const { authUser } = useAuthStore();
  const { data: allMembers } = useGroupMembersQuery(groupId);

  const otherMembers = useMemo(() => {
    if (!allMembers || !authUser) return [];

    return allMembers.filter((member) => member.userId !== authUser.id);
  }, [allMembers, authUser]);

  return otherMembers;
};

export default useOtherMembersQueryUtils;
