import useOtherMembersQueryUtils from "@/hooks/react-query/domain/group-members/useOtherMembersQueryUtils";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import S from "./IdeaTable.styles";

interface Props {
  ideas: IdeaDto[];
}

const IdeaTable = (props: Props) => {
  const router = useRouter();
  const query = router.query as { groupId: string };

  const otherMembers = useOtherMembersQueryUtils(query.groupId);

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <S.Table stickyHeader>
        <S.TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: 64 }}>
              #
            </TableCell>
            <TableCell sx={{ minWidth: 200 }}>Idea</TableCell>
            <TableCell align="center">You</TableCell>
            {otherMembers.map((member) => (
              <TableCell key={member.userId} align="center">
                {member.user.username}
              </TableCell>
            ))}
          </TableRow>
        </S.TableHead>

        <TableBody>
          {props.ideas.map((idea, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>{idea.name}</TableCell>
              <TableCell align="center">You</TableCell>
              {otherMembers.map((member) => (
                <TableCell key={member.userId} align="center">
                  {member.user.username}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </S.Table>
    </TableContainer>
  );
};

export default IdeaTable;
