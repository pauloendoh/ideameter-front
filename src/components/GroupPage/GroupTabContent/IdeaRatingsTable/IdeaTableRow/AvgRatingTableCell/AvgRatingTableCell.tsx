import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import { TableCell, Tooltip } from "@mui/material"
import { format } from "timeago.js"

interface Props {
  ideaRating: IdeaRating
}

const AvgRatingTableCell = (props: Props) => {
  return (
    <TableCell
      align="center"
      sx={{
        background: Number(props.ideaRating.avgRating) >= 2.5 ? "#232323" : undefined,
      }}
    >
      <Tooltip
        title={
          props.ideaRating.idea.completedAt
            ? format(props.ideaRating.idea.completedAt)
            : ""
        }
      >
        <div>{props.ideaRating.avgRating}</div>
      </Tooltip>
    </TableCell>
  )
}

export default AvgRatingTableCell
