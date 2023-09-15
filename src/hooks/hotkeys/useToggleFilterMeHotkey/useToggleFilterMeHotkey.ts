import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import { pushOrRemove } from "@/utils/array/pushOrRemove"
import { useHotkeys } from "react-hotkeys-hook"

export const useToggleFilterMeHotkey = () => {
  const { filter, changeFilterUsers } = useGroupFilterStore()

  const authUser = useAuthStore((s) => s.authUser)
  const { tabId, groupId } = useRouterQueryString()
  const { data: groupMembers } = useGroupMembersQuery(groupId)

  return useHotkeys(
    "shift+2",
    (e) => {
      e.preventDefault()
      if (groupMembers && authUser) {
        const authUserMember = groupMembers.find(
          (m) => m.userId === authUser.id
        )
        if (authUserMember) {
          changeFilterUsers(
            pushOrRemove(filter.users, authUserMember.user!, "id"),
            tabId
          )
        }
      }
    },

    [filter, tabId, groupMembers]
  )
}
