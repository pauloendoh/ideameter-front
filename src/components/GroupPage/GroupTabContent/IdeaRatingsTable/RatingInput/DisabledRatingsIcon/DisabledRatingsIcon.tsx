import { Tooltip } from "@mui/material"
import { MdClose } from "react-icons/md"

type Props = {}

const DisabledRatingsIcon = (props: Props) => {
  return (
    <Tooltip
      title={
        <div>
          Ratings are disabled for this idea. <br /> Check subideas.
        </div>
      }
      arrow
    >
      <div>
        <MdClose />
      </div>
    </Tooltip>
  )
}

export default DisabledRatingsIcon
