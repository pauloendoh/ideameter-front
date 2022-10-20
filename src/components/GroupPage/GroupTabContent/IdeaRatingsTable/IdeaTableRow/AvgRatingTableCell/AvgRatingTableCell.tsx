import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import { TableCell } from "@mui/material"

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
      {props.ideaRating.avgRating}
    </TableCell>
  )
}

export default AvgRatingTableCell
