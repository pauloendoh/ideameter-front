import useRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useRatingsQuery"
import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import useIdeaSortStore from "@/hooks/zustand/domain/group/useIdeaSortStore"
import { TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import S from "./IdeaTable.styles"
import IdeaTableRow from "./IdeaTableRow/IdeaTableRow"
import { useFilterAndSortIdeaRatings } from "./useFilterAndSortIdeaRatings/useFilterAndSortIdeaRatings"
import { useIdeaRequiresYourRating } from "./useIdeaRequiresYourRating"
import useMultiSelectIdeas from "./useMultiSelectIdeas/useMultiSelectIdeas"
import UserTableCell from "./UserTableCell/UserTableCell"

interface Props {
  ideaRatings: IdeaRating[]
}

const IdeaRatingsTable = (props: Props) => {
  const authUser = useAuthStore((s) => s.authUser)

  const { groupId } = useRouterQueryString()
  const { data: ratings } = useRatingsQuery(groupId!)

  const ideaRequiresYourRating = useIdeaRequiresYourRating(props.ideaRatings, ratings)

  const filter = useGroupFilterStore((s) => s.filter)

  const sortingBy = useIdeaSortStore((s) => s.sortingBy)

  const visibleIdeaRatings = useFilterAndSortIdeaRatings({
    ratings,
    ideaRatings: props.ideaRatings,
    sortingBy,
    ideaRequiresYourRating,
    authUserId: authUser!.id,
    filter,
  })

  const { onCtrlClick, onShiftClick } = useMultiSelectIdeas()

  if (props.ideaRatings.length === 0) return <div></div>

  return (
    <TableContainer sx={{ maxHeight: "calc(100vh - 376px)" }}>
      <S.Table stickyHeader>
        <S.TableHead>
          <TableRow>
            <TableCell align="center" width="64px">
              #
            </TableCell>
            <TableCell width="360px">Idea</TableCell>
            <TableCell width="64px">Done</TableCell>
            <TableCell align="center" width="64px">
              Avg
            </TableCell>
            <UserTableCell userId={authUser!.id} />
            {props.ideaRatings[0].otherUserGroupRatings.map((otherRating) => (
              <UserTableCell
                key={JSON.stringify(otherRating)}
                userId={otherRating.userGroup.userId}
              />
            ))}

            {/* Empty cell to avoid bigger width on the last cell */}
            <TableCell></TableCell>
          </TableRow>
        </S.TableHead>

        <TableBody>
          {visibleIdeaRatings.map((ideaRating, index) => (
            <IdeaTableRow
              key={ideaRating.idea.id + ideaRating.idea.updatedAt}
              ideaRating={ideaRating}
              rowNumber={index + 1}
              onCtrlClick={() => onCtrlClick(ideaRating.idea.id)}
              onShiftClick={() =>
                onShiftClick(
                  visibleIdeaRatings.map((r) => r.idea.id),
                  ideaRating.idea.id
                )
              }
            />
          ))}
        </TableBody>
      </S.Table>
    </TableContainer>
  )
}

export default IdeaRatingsTable
