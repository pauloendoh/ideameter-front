import useOtherMembersQueryUtils from "@/hooks/react-query/domain/group-members/useOtherMembersQueryUtils";
import useRatingsByGroupQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useRatingsByGroupQuery";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import S from "./IdeaTable.styles";
import RatingInput from "./RatingInput/RatingInput";

interface Props {
  ideas: IdeaDto[];
}

const IdeaTable = (props: Props) => {
  const router = useRouter();
  const query = router.query as { groupId: string };

  const otherMembers = useOtherMembersQueryUtils(query.groupId);

  const { data: groupRatings } = useRatingsByGroupQuery(query.groupId);

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
    <TableContainer sx={{ maxHeight: 440 }}>
      <S.Table stickyHeader>
        <S.TableHead>
          <TableRow>
            <TableCell align="center" width="64px">
              #
            </TableCell>
            <TableCell width="200px">Idea</TableCell>
            <TableCell align="center" width="64px">
              Avg
            </TableCell>
            <TableCell align="center" width="64px">
              You
            </TableCell>
            {otherMembers.map((member) => (
              <TableCell key={member.userId} align="center" width="100px">
                {member.user.username}
              </TableCell>
            ))}

            {/* Empty cell to avoid bigger width on the last cell */}
            <TableCell></TableCell>
          </TableRow>
        </S.TableHead>

        <TableBody>
          {props.ideas.map((idea, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>{idea.name}</TableCell>
              <TableCell
                align="center"
                sx={{
                  background:
                    Number(getAvgIdeaRating(idea.id)) >= 2.5
                      ? "#232323"
                      : undefined,
                }}
              >
                {getAvgIdeaRating(idea.id)}
              </TableCell>
              <TableCell align="center">
                <RatingInput idea={idea} groupId={query.groupId} />
              </TableCell>
              {otherMembers.map((member) => (
                <TableCell key={member.userId} align="center">
                  {getUserRatingString(member.userId, idea.id)}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </S.Table>
    </TableContainer>
  );
};

export default IdeaTable;
