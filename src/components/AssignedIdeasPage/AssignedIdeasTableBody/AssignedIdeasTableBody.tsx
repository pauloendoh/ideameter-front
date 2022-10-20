import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import urls from "@/utils/urls"
import { Link, TableBody, TableCell } from "@mui/material"
import NextLink from "next/link"
import S from "./AssignedIdeasTableBody.styles"

type Props = { ideas: AssignedToMeDto[] }

const AssignedIdeasTableBody = ({ ideas }: Props) => {
  return (
    <TableBody>
      {ideas.map(({ group, tab, idea }, index) => {
        const ideaUrl = urls.pages.groupTabIdea(group.groupId, tab.id, idea.id)

        return (
          <S.TableRow id={idea.id} className="idea-table-row">
            <TableCell align="center">{index + 1}</TableCell>
            <TableCell>
              <NextLink href={ideaUrl} key={idea.id} passHref>
                <Link>{idea.name}</Link>
              </NextLink>
            </TableCell>
            <TableCell>{group.name}</TableCell>
            <TableCell>{tab.name}</TableCell>
          </S.TableRow>
        )
      })}
    </TableBody>
  )
}

export default AssignedIdeasTableBody
