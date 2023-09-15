import useRatingsQuery from "@/hooks/react-query/domain/group/tab/idea/rating/useRatingsQuery"
import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableProps,
  TableRow,
} from "@mui/material"
import React, { useMemo, useRef } from "react"
import {
  ItemProps,
  TableComponents,
  TableVirtuoso,
  TableVirtuosoHandle,
} from "react-virtuoso"
import IdeaTableRow from "./IdeaTableRow/IdeaTableRow"
import UserTableCell from "./UserTableCell/UserTableCell"
import { useFilterAndSortIdeaRatings } from "./useFilterAndSortIdeaRatings/useFilterAndSortIdeaRatings"
import { useIdeaRequiresYourRating } from "./useIdeaRequiresYourRating"
import useMultiSelectIdeas from "./useMultiSelectIdeas/useMultiSelectIdeas"

interface Props {
  ideaRatings: IdeaRating[]
  isSubideasTable?: boolean
}

// PE 1/3 - IdeaTable
const IdeaRatingsTable = ({ ...props }: Props) => {
  const authUser = useAuthStore((s) => s.authUser)

  const { groupId } = useRouterQueryString()
  const { data: ratings } = useRatingsQuery(groupId!)

  const ideaRequiresYourRating = useIdeaRequiresYourRating(
    props.ideaRatings,
    ratings
  )

  const { filter, sortingBy } = useGroupFilterStore()

  const visibleIdeaRatings = useFilterAndSortIdeaRatings({
    ratings,
    ideaRatings: props.ideaRatings,
    sortingBy,
    ideaRequiresYourRating,
    authUserId: authUser!.id,
    filter,
    isSubideasTable: props.isSubideasTable,
  })

  const { onCtrlClick, onShiftClick } = useMultiSelectIdeas()

  const ref = useRef<TableVirtuosoHandle>(null)

  const tableComponents = useMemo<TableComponents<IdeaRating, any>>(() => {
    return {
      Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer {...props} ref={ref} />
      )),
      Table: (props: TableProps) => <Table {...props} />,
      TableHead: TableHead,
      TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} />
      )),
      TableRow: React.forwardRef<HTMLTableRowElement, ItemProps<IdeaRating>>(
        (itemProps, ref) => (
          <IdeaTableRow
            key={itemProps.item.idea.id + itemProps.item.idea.updatedAt}
            ideaRating={itemProps.item}
            rowNumber={itemProps["data-index"] + 1}
            onCtrlClick={() => {
              onCtrlClick(itemProps.item.idea.id)
            }}
            onShiftClick={() =>
              onShiftClick(
                visibleIdeaRatings.map((r) => r.idea.id),
                itemProps.item.idea.id
              )
            }
            virtuosoProps={itemProps}
            ref={ref}
          />
        )
      ),
    }
  }, [])

  if (props.ideaRatings.length === 0) return <div></div>

  if (!props.isSubideasTable && visibleIdeaRatings.length > 5)
    return (
      <Box
        sx={{
          "td, th": {
            padding: 1,
          },
          th: {
            backgroundColor: "#2b2b2b",
          },
        }}
      >
        <TableVirtuoso
          ref={ref}
          style={{
            height: "calc(100vh - 400px)",
          }}
          data={visibleIdeaRatings}
          components={tableComponents}
          fixedHeaderContent={() => (
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
          )}
        />
      </Box>
    )

  return (
    <TableContainer>
      <Table
        sx={{
          "td, th": {
            padding: 1,
          },
          th: {
            backgroundColor: "#2b2b2b",
          },
        }}
      >
        <TableHead>
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
        </TableHead>
        <TableBody>
          {visibleIdeaRatings.map((ideaRating, index) => (
            <IdeaTableRow
              key={ideaRating.idea.id + ideaRating.idea.updatedAt}
              ideaRating={ideaRating}
              rowNumber={index + 1}
              onCtrlClick={() => {
                onCtrlClick(ideaRating.idea.id)
              }}
              onShiftClick={() =>
                onShiftClick(
                  visibleIdeaRatings.map((r) => r.idea.id),
                  ideaRating.idea.id
                )
              }
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default IdeaRatingsTable
