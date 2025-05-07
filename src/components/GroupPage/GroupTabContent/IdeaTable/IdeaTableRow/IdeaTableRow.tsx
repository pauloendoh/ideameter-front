import { useSelectIdeaLabelsHotkey } from "@/hooks/hotkeys/useSelectIdeaLabelsHotkey/useSelectIdeaLabelsHotkey"
import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import useSubideaDialogStore from "@/hooks/zustand/dialogs/useSubideaDialogStore"
import urls from "@/utils/urls"
import { Checkbox, TableCell, TableRow, useTheme } from "@mui/material"
import { useRouter } from "next/router"
import React, { useMemo, useState } from "react"
import { ItemProps } from "react-virtuoso"
import { useAssignMeHotkey } from "../../../../../hooks/hotkeys/useAssignMeHotkey/useAssignMeHotkey"
import { useToggleVoteHotkey } from "../../../../../hooks/hotkeys/useToggleVoteHotkey/useToggleVoteHotkey"
import RatingInput from "../RatingInput/RatingInput"
import useMultiSelectIdeas from "../useMultiSelectIdeas/useMultiSelectIdeas"
import AvgRatingTableCell from "./AvgRatingTableCell/AvgRatingTableCell"
import IdeaNameTableCell from "./IdeaNameTableCell/IdeaNameTableCell"
import { OtherUserRatingCell } from "./OtherUserRatingCell/OtherUserRatingCell"
interface Props {
  ideaRating: IdeaRating
  rowNumber: number
  onCtrlClick: () => void
  onShiftClick: () => void
  virtuosoProps?: ItemProps<IdeaRating>
}

const IdeaTableRow = React.forwardRef<HTMLTableRowElement, Props>(
  (props, ref) => {
    const router = useRouter()
    const openIdeaDialog = useIdeaDialogStore((s) => s.openDialog)
    const openSubideaDialog = useSubideaDialogStore((s) => s.openDialog)
    const query = router.query as { groupId: string }

    const { mutate: submitSaveIdea } = useSaveIdeaMutation()

    const [isHoveringIdeaId, setHoveringIdeaId] = useState<string | null>(null)

    useAssignMeHotkey(isHoveringIdeaId)
    useToggleVoteHotkey(isHoveringIdeaId)
    useSelectIdeaLabelsHotkey(isHoveringIdeaId)

    const isSubidea = useMemo(
      () => !!props.ideaRating.idea.parentId,
      [props.ideaRating]
    )

    const { idIsSelected } = useMultiSelectIdeas()
    const theme = useTheme()

    return (
      <TableRow
        {...props.virtuosoProps}
        ref={ref}
        id={`idea-${props.ideaRating.idea.id}`}
        className="idea-table-row"
        hover
        onMouseEnter={() => {
          setHoveringIdeaId(props.ideaRating.idea.id)
        }}
        onMouseLeave={() => {
          setHoveringIdeaId(null)
        }}
        sx={{
          ":hover": {
            cursor: "pointer",
          },
          background: idIsSelected(props.ideaRating.idea.id)
            ? `${theme.palette.grey[700]} !important`
            : undefined,
        }}
        onClick={(e) => {
          if (isSubidea) {
            openSubideaDialog(props.ideaRating.idea)
            return
          }

          if (e.ctrlKey) {
            e.preventDefault()
            props.onCtrlClick()
            return
          }

          if (e.shiftKey) {
            e.preventDefault()

            props.onShiftClick()
            return
          }

          openIdeaDialog(props.ideaRating.idea)
        }}
        onMouseDown={(e) => {
          // middle mouse button, open idea in new tab
          if (e.button === 1) {
            e.preventDefault()
            window.open(
              urls.pages.groupTabIdea(
                query.groupId,
                props.ideaRating.idea.tabId!,
                props.ideaRating.idea.id
              )
            )
          }
        }}
      >
        <TableCell align="center">{props.rowNumber}</TableCell>
        <IdeaNameTableCell ideaRating={props.ideaRating} />

        <TableCell>
          <Checkbox
            checked={props.ideaRating.idea.isDone}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              submitSaveIdea({
                ...props.ideaRating.idea,
                isDone: e.target.checked,
              })
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
        </TableCell>
        <AvgRatingTableCell ideaRating={props.ideaRating} />
        <TableCell align="center">
          <RatingInput
            idea={props.ideaRating.idea}
            groupId={query.groupId}
            isDisabled={props.ideaRating.idea.ratingsAreEnabled === false}
          />
        </TableCell>
        {props.ideaRating.otherUserGroupRatings.map(
          (userGroupRating, index) => (
            <OtherUserRatingCell
              ideaRating={props.ideaRating}
              theirRating={userGroupRating}
              key={JSON.stringify(userGroupRating) + index}
            />
          )
        )}

        {/* Empty cell to avoid bigger width on the last cell */}
        <TableCell></TableCell>
      </TableRow>
    )
  }
)

export default IdeaTableRow
