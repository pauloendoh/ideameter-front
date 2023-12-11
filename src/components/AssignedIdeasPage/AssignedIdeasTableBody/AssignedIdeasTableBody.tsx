import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import { TableBody } from "@mui/material"
import AssignedIdeasTableRow from "./AssignedIdeasTableRow/AssignedIdeasTableRow"

type Props = {
  ideas: AssignedToMeDto[]
  showCompleted: boolean
  showVotedAt?: boolean
  isHighlyRatedIdeasPage?: boolean
}

const AssignedIdeasTableBody = ({ ideas, showCompleted, ...props }: Props) => {
  return (
    <TableBody>
      {ideas.map((assignment, index) => {
        return (
          <AssignedIdeasTableRow
            assignment={assignment}
            showCompleted={showCompleted}
            showVotedAt={props.showVotedAt}
            index={index}
            isHighlyRatedIdeasPage={props.isHighlyRatedIdeasPage}
          />
        )
      })}
    </TableBody>
  )
}

export default AssignedIdeasTableBody
