import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import urls from "@/utils/urls"
import { TableBody } from "@mui/material"
import AssignedIdeasTableRow from "./AssignedIdeasTableRow/AssignedIdeasTableRow"

type Props = {
  ideas: AssignedToMeDto[]
  showCompleted: boolean
  showVotedAt?: boolean
  isHighlyRatedIdeasPage?: boolean
}

const AssignedIdeasTableBody = ({ ideas, showCompleted, ...props }: Props) => {
  const handleOpenNext5 = (index: number) => {
    const clickedIdea = { ...ideas[index] }

    const groupId = clickedIdea.group.groupId
    const tabId = clickedIdea.tab.tabId

    const next5 = ideas.slice(index, index + 5)
    for (const idea of next5) {
      if (idea.tab.tabId === tabId) {
        // open on new tab
        window.open(urls.pages.groupTabIdea(groupId, tabId, idea.idea.id))
      }
    }
  }
  return (
    <TableBody>
      {ideas.map((idea, index) => {
        return (
          <AssignedIdeasTableRow
            key={idea.idea.id}
            ideaAssignment={idea}
            showCompleted={showCompleted}
            showVotedAt={props.showVotedAt}
            index={index}
            isHighlyRatedIdeasPage={props.isHighlyRatedIdeasPage}
            onOpenNext5={() => {
              handleOpenNext5(index)
            }}
          />
        )
      })}
    </TableBody>
  )
}

export default AssignedIdeasTableBody
