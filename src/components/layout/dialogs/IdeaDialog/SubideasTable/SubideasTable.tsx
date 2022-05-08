import IdeaRatingsTable from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/IdeaRatingsTable";
import useSubideaRatingsQueryUtils from "@/hooks/react-query/domain/rating/useSubideaRatingsQueryUtils";
import { LinearProgress } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  parentId: string;
}

const SubideasTable = (props: Props) => {
  const query = useRouter().query as { groupId: string };

  const { data: subideaRatings, isLoading } = useSubideaRatingsQueryUtils(
    props.parentId,
    query.groupId
  );

  return (
    <div>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <IdeaRatingsTable ideaRatings={subideaRatings} />
      )}
    </div>
  );
};

export default SubideasTable;
