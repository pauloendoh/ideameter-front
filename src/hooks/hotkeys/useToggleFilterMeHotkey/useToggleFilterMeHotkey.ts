import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useGroupFilterStore from "@/hooks/zustand/domain/auth/group/useGroupFilterStore"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import { useHotkeys } from "react-hotkeys-hook"

export const useToggleFilterMeHotkey = () => {
  const [filter, changeFilterUsers] = useGroupFilterStore((s) => [
    s.filter,
    s.changeFilterUsers,
  ])

  const authUser = useAuthStore((s) => s.authUser)
  const { tabId, groupId } = useRouterQueryString()
  const { data: groupMembers } = useGroupMembersQuery(groupId)

  return useHotkeys(
    "Shift+2",
    () => {
      if (groupMembers && authUser) {
        const authUserMember = groupMembers.find(
          (m) => m.userId === authUser.id
        )
        if (authUserMember) {
          changeFilterUsers(
            pushOrRemove(filter.users, authUserMember.user, "id")
          )
        }
      }
    },
    [filter, tabId, groupMembers]
  )
}