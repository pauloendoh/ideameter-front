import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import { TableCell, Tooltip } from "@mui/material"
import { upToNDecimals } from "endoh-utils"
import { useMemo } from "react"
import { format } from "timeago.js"
import DisabledRatingsIcon from "../../RatingInput/DisabledRatingsIcon/DisabledRatingsIcon"

interface Props {
  ideaRating: IdeaRating
}

const AvgRatingTableCell = (props: Props) => {
  const ratingsAreDisabled = useMemo(() => {
    return !props.ideaRating.idea.ratingsAreEnabled
  }, [props.ideaRating.idea.ratingsAreEnabled])
  return (
    <TableCell
      align="center"
      sx={{
        background:
          Number(props.ideaRating.avgRating) >= 2.5 ? "#232323" : undefined,
      }}
    >
      {ratingsAreDisabled ? (
        <DisabledRatingsIcon />
      ) : (
        <>
          <Tooltip
            title={
              props.ideaRating.idea.completedAt
                ? format(props.ideaRating.idea.completedAt)
                : ""
            }
          >
            <div>
              {props.ideaRating.avgRating &&
                upToNDecimals(props.ideaRating.avgRating, 1)}
            </div>
          </Tooltip>
        </>
      )}
    </TableCell>
  )
}

export default AvgRatingTableCell
