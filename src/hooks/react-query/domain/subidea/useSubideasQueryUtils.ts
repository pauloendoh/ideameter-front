import { useMemo } from "react"
import useSubideasQuery from "./useSubideasQuery"

const useSubideasQueryUtils = (params: { groupId: string; ideaId: string }) => {
  const { groupId, ideaId } = params
  const { data, isLoading, isFetching } = useSubideasQuery(groupId)

  const subideas = useMemo(() => {
    return data?.filter((d) => d.parentId === ideaId) || []
  }, [data, ideaId])

  return {
    data: subideas,
    isLoading,
    isFetching,
  }
}

export default useSubideasQueryUtils
