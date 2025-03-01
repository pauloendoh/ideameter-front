import { useMemo } from "react"
import useGroupsQuery from "./useGroupsQuery"

export const useGroupQueryUtils = (
  groupId: string,
  options?: {
    onGroupNotFound?: () => void
  }
) => {
  const { data: groups } = useGroupsQuery()
  const selectedGroup = useMemo(() => {
    if (groupId) {
      const foundGroup = groups?.find((group) => group.id === groupId)

      if (groups && !foundGroup && options?.onGroupNotFound) {
        options.onGroupNotFound()

        return null
      }

      return foundGroup ?? null
    }

    return null
  }, [groups, groupId])

  return selectedGroup
}
