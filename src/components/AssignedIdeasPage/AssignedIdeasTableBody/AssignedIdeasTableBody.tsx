import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import urls from "@/utils/urls"
import { TableBody, TableCell } from "@mui/material"
import Link from "next/link"
import S from "./AssignedIdeasTableBody.styles"

type AssignedToMeBodyProps = { ideas: AssignedToMeDto[] }

const AssignedIdeasTableBody = ({ ideas }: AssignedToMeBodyProps) => {
  return (
    <TableBody>
      {ideas.map(({ group, tab, idea }, index) => {
        const ideaUrl = urls.pages.groupTabIdea(group.id, tab.id, idea.id)

        return (
          <Link href={ideaUrl} key={idea.id}>
            <S.TableRow id={idea.id} className="idea-table-row" hover>
              <TableCell align="center">{index + 1}</TableCell>
              <TableCell>{idea.name}</TableCell>
              <TableCell>{group.name}</TableCell>
              <TableCell>{tab.name}</TableCell>
            </S.TableRow>
          </Link>
        )
      })}
    </TableBody>
  )
}

export default AssignedIdeasTableBody
