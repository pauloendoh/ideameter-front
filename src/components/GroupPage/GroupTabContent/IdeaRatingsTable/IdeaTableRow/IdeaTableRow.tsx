import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import useSubideaDialogStore from "@/hooks/zustand/dialogs/useSubideaDialogStore"
import { Checkbox, TableCell, TableRow } from "@mui/material"
import { useRouter } from "next/router"
import { useState } from "react"
import { useAssignMeHotkey } from "../../../../../hooks/hotkeys/useAssignMeHotkey/useAssignMeHotkey"
import { useToggleVoteHotkey } from "../../../../../hooks/hotkeys/useToggleVoteHotkey/useToggleVoteHotkey"
import RatingInput from "../RatingInput/RatingInput"
import AvgRatingTableCell from "./AvgRatingTableCell/AvgRatingTableCell"
import IdeaNameTableCell from "./IdeaNameTableCell/IdeaNameTableCell"
interface Props {
  ideaRating: IdeaRating
  rowNumber: number
}

const IdeaTableRow = (props: Props) => {
  const router = useRouter()
  const openIdeaDialog = useIdeaDialogStore((s) => s.openDialog)
  const openSubideaDialog = useSubideaDialogStore((s) => s.openDialog)
  const query = router.query as { groupId: string }

  const { mutate: submitSaveIdea } = useSaveIdeaMutation()

  const [isHoveringIdeaId, setHoveringIdeaId] = useState<string | null>(null)

  useAssignMeHotkey(isHoveringIdeaId)
  useToggleVoteHotkey(isHoveringIdeaId)

  return (
    <TableRow
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
      }}
      onClick={() => {
        if (props.ideaRating.idea.parentId) {
          openSubideaDialog(props.ideaRating.idea)
          return
        }

        openIdeaDialog(props.ideaRating.idea)
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
          parentId={props.ideaRating.idea.parentId}
        />
      </TableCell>
      {props.ideaRating.otherUserGroupRatings.map((userGroupRating, index) => (
        <TableCell key={JSON.stringify(userGroupRating)} align="center">
          {userGroupRating.rating}
        </TableCell>
      ))}

      {/* Empty cell to avoid bigger width on the last cell */}
      <TableCell></TableCell>
    </TableRow>
  )
}

export default IdeaTableRow
