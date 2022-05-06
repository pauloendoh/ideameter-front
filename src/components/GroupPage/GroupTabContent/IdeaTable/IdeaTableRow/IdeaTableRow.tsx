import useOtherMembersQueryUtils from "@/hooks/react-query/domain/group-members/useOtherMembersQueryUtils";
import useGroupRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useGroupRatingsQuery";
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { TableCell, TableRow } from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import RatingInput from "../RatingInput/RatingInput";

interface Props {
  idea: IdeaDto;
  rowNumber: number;
}

const IdeaTableRow = (props: Props) => {
  const router = useRouter();
  const { openDialog } = useIdeaDialogStore();
  const query = router.query as { groupId: string };
  const otherMembers = useOtherMembersQueryUtils(query.groupId);
  const { data: groupRatings } = useGroupRatingsQuery(query.groupId);

  const getUserRatingString = useCallback(
    (userId: string, ideaId: string) => {
      if (!groupRatings) return "";
      const userRating = groupRatings.find(
        (r) => r.ideaId === ideaId && r.userId === userId
      );

      if (!userRating) return "";
      if (userRating.rating === null) return "-";
      return userRating.rating.toString();
    },
    [groupRatings]
  );

  const getAvgIdeaRating = useCallback(
    (ideaId: string) => {
      if (!groupRatings) return null;
      const ideaRatings = groupRatings.filter((r) => r.ideaId === ideaId);
      if (ideaRatings.length === 0) return null;

      const validRatings = ideaRatings.filter((r) => r.rating !== null);
      const sum = validRatings.reduce(
        (partialSum, r) => partialSum + (r.rating || 0),
        0
      );

      if (sum === 0) return null;
      return sum / validRatings.length;
    },
    [groupRatings]
  );

  return (
    <TableRow
      hover
      sx={{ ":hover": { cursor: "pointer" } }}
      onClick={() => openDialog(props.idea)}
    >
      <TableCell align="center">{props.rowNumber}</TableCell>
      <TableCell>{props.idea.name}</TableCell>
      <TableCell
        align="center"
        sx={{
          background:
            Number(getAvgIdeaRating(props.idea.id)) >= 2.5
              ? "#232323"
              : undefined,
        }}
      >
        {getAvgIdeaRating(props.idea.id)}
      </TableCell>
      <TableCell align="center">
        <RatingInput idea={props.idea} groupId={query.groupId} />
      </TableCell>
      {otherMembers.map((member) => (
        <TableCell key={member.userId} align="center">
          {getUserRatingString(member.userId, props.idea.id)}
        </TableCell>
      ))}
      <TableCell></TableCell>
    </TableRow>
  );
};

export default IdeaTableRow;
