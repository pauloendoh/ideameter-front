import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import { useMemo } from "react"

export const useCurrentGroup = (options?: { onGroupNotFound?: () => void }) => {
  const { data: groups } = useGroupsQuery()
  const { groupId: groupIdQuery } = useRouterQueryString()

  const selectedGroup = useMemo(() => {
    if (groupIdQuery) {
      const foundGroup = groups?.find((group) => group.id === groupIdQuery)

      if (groups && !foundGroup && options?.onGroupNotFound) {
        options.onGroupNotFound()

        return null
      }

      return foundGroup
    }

    return null
  }, [groups, groupIdQuery])

  return selectedGroup
}
