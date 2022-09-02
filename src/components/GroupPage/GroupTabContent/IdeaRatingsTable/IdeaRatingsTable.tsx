import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils";
import useGroupFilterStore from "@/hooks/zustand/domain/auth/group/useGroupFilterStore";
import {
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useRouter } from "next/router";
import { useMemo } from "react";
import S from "./IdeaTable.styles";
import IdeaTableRow from "./IdeaTableRow/IdeaTableRow";

interface Props {
  ideaRatings: IdeaRating[];
}

const IdeaRatingsTable = (props: Props) => {
  const router = useRouter();
  const query = router.query as { groupId: string };

  const hidingDone = useGroupFilterStore((s) => s.filter.hidingDone);

  const visibleIdeaRatings = useMemo(() => {
    let result = [...props.ideaRatings];
    result = result.sort((a, b) =>
      Number(a.avgRating) > Number(b.avgRating) ? -1 : 1
    );

    if (hidingDone) result = result.filter((r) => !r.idea.isDone);

    return result;
  }, [props.ideaRatings, hidingDone]);

  if (props.ideaRatings.length === 0) return <div></div>;

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <S.Table stickyHeader>
        <S.TableHead>
          <TableRow>
            <TableCell align="center" width="64px">
              #
            </TableCell>
            <TableCell width="360px">Idea</TableCell>
            <TableCell width="64px">Done</TableCell>
            <TableCell align="center" width="64px" sortDirection="desc">
              <TableSortLabel active direction="desc">
                Avg
                <Box component="span" sx={visuallyHidden}>
                  sorted descending
                </Box>
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" width="64px">
              You
            </TableCell>
            {props.ideaRatings[0].otherUserGroupRatings.map((otherRating) => (
              <TableCell
                key={JSON.stringify(otherRating)}
                align="center"
                width="100px"
              >
                {otherRating.userGroup.user.username}
              </TableCell>
            ))}

            {/* Empty cell to avoid bigger width on the last cell */}
            <TableCell></TableCell>
          </TableRow>
        </S.TableHead>

        <TableBody>
          {visibleIdeaRatings.map((ideaRating, index) => (
            <IdeaTableRow
              key={ideaRating.idea.id}
              ideaRating={ideaRating}
              rowNumber={index + 1}
            />
          ))}
        </TableBody>
      </S.Table>
    </TableContainer>
  );
};

export default IdeaRatingsTable;
