import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils";
import { getOnFireSinceFormat } from "@/utils/domain/idea/getOnFireSinceFormat";
import { TableCell, Tooltip } from "@mui/material";
import { DateTime } from "luxon";
import { useMemo } from "react";

interface Props {
  ideaRating: IdeaRating;
}

const AvgRatingTableCell = (props: Props) => {
  const { onFireSince } = props.ideaRating.idea;

  const tooltipTitle = useMemo(() => {
    if (!onFireSince) return "";

    const format = getOnFireSinceFormat(onFireSince);
    return DateTime.fromISO(onFireSince).toFormat(format);
  }, [props.ideaRating.idea.onFireSince]);
  return (
    <Tooltip title={tooltipTitle} arrow placement="top">
      <TableCell
        align="center"
        sx={{
          background:
            Number(props.ideaRating.avgRating) >= 2.5 ? "#232323" : undefined,
        }}
      >
        {props.ideaRating.avgRating}
      </TableCell>
    </Tooltip>
  );
};

export default AvgRatingTableCell;
