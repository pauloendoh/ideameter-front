import useSubideasQuery from "@/hooks/react-query/domain/subidea/useSubideasQuery";
import React from "react";

interface Props {
  parentId: string;
}

const SubideasTable = (props: Props) => {
  const { data } = useSubideasQuery(props.parentId);
  return <div>{JSON.stringify(data)}</div>;
};

export default SubideasTable;
