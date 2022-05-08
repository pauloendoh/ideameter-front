import { useMemo } from "react";
import useSubideasQuery from "./useSubideasQuery";

interface Params {
  ideaId: string;
}

const useSubideasQueryUtils = (groupId: string, { ideaId }: Params) => {
  const { data, isLoading, isFetching } = useSubideasQuery(groupId);

  const subideas = useMemo(() => {
    return data?.filter((d) => d.parentId === ideaId) || [];
  }, [data, ideaId]);

  return {
    data: subideas,
    isLoading,
    isFetching,
  };
};

export default useSubideasQueryUtils;
