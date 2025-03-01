import { useGroupQueryUtils } from "@/hooks/react-query/domain/group/useGroupQueryUtils"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"

export const useCurrentGroup = (options?: { onGroupNotFound?: () => void }) => {
  const { groupId: groupIdQuery } = useRouterQueryString()

  return useGroupQueryUtils(groupIdQuery, { ...options })
}
