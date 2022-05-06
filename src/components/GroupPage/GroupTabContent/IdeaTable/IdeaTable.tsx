import useOtherMembersQueryUtils from "@/hooks/react-query/domain/group-members/useOtherMembersQueryUtils";
import useGroupRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useGroupRatingsQuery";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import S from "./IdeaTable.styles";
import IdeaTableRow from "./IdeaTableRow/IdeaTableRow";

interface Props {
  ideas: IdeaDto[];
}

const IdeaTable = (props: Props) => {
  const router = useRouter();
  const query = router.query as { groupId: string };

  const otherMembers = useOtherMembersQueryUtils(query.groupId);

  const { data: groupRatings } = useGroupRatingsQuery(query.groupId);

  const sortedIdeas = useMemo(() => {
    return props.ideas.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [props.ideas]);

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
          {sortedIdeas.map((idea, index) => (
            <IdeaTableRow idea={idea} rowNumber={index + 1} />
          ))}
        </TableBody>
      </S.Table>
    </TableContainer>
  );
};

export default IdeaTable;
