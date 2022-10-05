import useRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useRatingsQuery"
import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useGroupFilterStore from "@/hooks/zustand/domain/auth/group/useGroupFilterStore"
import useIdeaSortStore from "@/hooks/zustand/domain/auth/group/useIdeaSortStore"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import { useMemo } from "react"
import S from "./IdeaTable.styles"
import IdeaTableRow from "./IdeaTableRow/IdeaTableRow"
import { useIdeaRequiresYourRating } from "./useIdeaRequiresYourRating"
import UserTableCell from "./UserTableCell/UserTableCell"

interface Props {
  ideaRatings: IdeaRating[]
}

const IdeaRatingsTable = (props: Props) => {
  const authUser = useAuthStore((s) => s.authUser)

  const { groupId } = useRouterQueryString()
  const { data: ratings } = useRatingsQuery(groupId!)

  const ideaRequiresYourRating = useIdeaRequiresYourRating(
    props.ideaRatings,
    ratings
  )

  const [
    onlyCompletedIdeas,
    filteringUsers,
    onlyHighImpactVoted,
    requiresYourRating,
    selectedLabelIds,
  ] = useGroupFilterStore((s) => [
    s.filter.onlyCompletedIdeas,
    s.filter.users,
    s.filter.onlyHighImpactVoted,
    s.filter.requiresYourRating,
    s.filter.labelIds,
  ])

  const sortingBy = useIdeaSortStore((s) => s.sortingBy)

  // PE 1/3 - put this filter + sort function in a separated file
  const visibleIdeaRatings = useMemo(() => {
    let result = [...props.ideaRatings]

    result = result.filter((r) => {
      if (r.idea.parentId) return true // subideas must always appear
      if (onlyCompletedIdeas && !r.idea.isDone) return false
      if (!onlyCompletedIdeas && r.idea.isDone) return false

      if (filteringUsers.length > 0) {
        const filteringIds = filteringUsers.map((u) => u.id)
        const currentUserIds = r.idea.assignedUsers.map((u) => u.id)
        if (
          !filteringIds.every((filteringId) =>
            currentUserIds.includes(filteringId)
          )
        )
          return false
      }

      return true
    })

    if (onlyHighImpactVoted)
      result = result.filter(
        (r) => r.idea.parentId || r.idea.highImpactVotes?.length > 0 // subideas must always appear in their table
      )

    if (requiresYourRating) {
      result = result.filter((ideaRating) => {
        if (!ideaRating.idea.isDone) {
          const foundUserIdeaRating =
            ratings?.find(
              (r) =>
                r.ideaId === ideaRating.idea.id && r.userId === authUser?.id
            ) || null
          if (!foundUserIdeaRating) return true

          for (const subidea of ideaRating.subideas) {
            const foundUserSubideaRating =
              ratings?.find(
                (r) => r.ideaId === subidea.id && r.userId === authUser?.id
              ) || null

            if (!foundUserSubideaRating) return true
          }
        }

        return false
      })
    }

    if (sortingBy.attribute === "irrelevantSince")
      result = result.sort((a, b) =>
        String(b.idea.irrelevantSince || "").localeCompare(
          String(a.idea.irrelevantSince || "")
        )
      )

    if (sortingBy.attribute === "createdAt")
      result = result.sort((a, b) =>
        b.idea.createdAt.localeCompare(a.idea.createdAt)
      )

    if (sortingBy.attribute === "updatedAt")
      result = result.sort((a, b) =>
        b.idea.updatedAt.localeCompare(a.idea.updatedAt)
      )

    if (sortingBy.attribute === "avgRating") {
      result = result.sort((a, b) => {
        const numRatingA = Number(a.avgRating)
        const numRatingB = Number(b.avgRating)
        // if both ideas have same avg rating, it will sort by ratings count
        if (numRatingA === numRatingB) {
          const youRatedIdeaA = a.yourRating ? 1 : 0
          const ratingsCountA =
            youRatedIdeaA +
            a.otherUserGroupRatings.filter((r) => r.rating).length

          const youRatedIdeaB = b.yourRating ? 1 : 0
          const ratingsCountB =
            youRatedIdeaB +
            b.otherUserGroupRatings.filter((r) => r.rating).length

          // if both ideas have same avg rating and same ratings count, it will sort by high impact votes count
          if (ratingsCountA === ratingsCountB) {
            return a.idea.highImpactVotes?.length >
              b.idea.highImpactVotes?.length
              ? -1
              : 1
          }

          return ratingsCountA > ratingsCountB ? -1 : 1
        }

        return numRatingA > numRatingB ? -1 : 1
      })
    }

    if (sortingBy.attribute === "requiresYourRating") {
      result = result.sort((a, b) => {
        if (
          ideaRequiresYourRating(b.idea.id) &&
          !ideaRequiresYourRating(a.idea.id)
        )
          return 1

        return -1
      })
    }

    if (selectedLabelIds.length > 0)
      result = result.filter((r) => {
        const labelIds = r.idea.labels.map((l) => l.id)
        return selectedLabelIds.every((id) => labelIds.includes(id))
      })

    return result
  }, [
    ratings,
    props.ideaRatings,
    onlyCompletedIdeas,
    filteringUsers,
    onlyHighImpactVoted,
    sortingBy,
    requiresYourRating,
    ideaRequiresYourRating,
    selectedLabelIds,
  ])

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
            />
          ))}
        </TableBody>
      </S.Table>
    </TableContainer>
  )
}

export default IdeaRatingsTable
