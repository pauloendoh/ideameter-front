import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import urls from "@/utils/urls"
import { Link, TableBody, TableCell, useTheme } from "@mui/material"
import NextLink from "next/link"
import { useMemo } from "react"
import S from "./AssignedIdeasTableBody.styles"

type Props = { ideas: AssignedToMeDto[]; showCompleted: boolean }

const AssignedIdeasTableBody = ({ ideas, showCompleted }: Props) => {
  const showingIdeas = useMemo(() => {
    if (showCompleted) return ideas.filter((i) => i.idea.isDone)

    return ideas.filter((i) => !i.idea.isDone)
  }, [ideas, showCompleted])
  return (
    <TableBody>
      {showingIdeas.map(({ group, tab, idea }, index) => {
        const ideaUrl = urls.pages.groupTabIdea(group.groupId, tab.id, idea.id)

        const theme = useTheme()
        return (
          <S.TableRow id={idea.id} key={idea.id} className="idea-table-row">
            <TableCell align="center">{index + 1}</TableCell>
            <TableCell>
              <NextLink href={ideaUrl} passHref>
                <Link color={theme.palette.grey[100]}>
                  {idea.name} - {idea.isDone && "is done"}
                </Link>
              </NextLink>
            </TableCell>
            <TableCell>
              <NextLink href={urls.pages.groupId(group.groupId)} passHref>
                <Link color={theme.palette.grey[100]}> {group.name}</Link>
              </NextLink>
            </TableCell>
            <TableCell>
              <NextLink href={urls.pages.groupTab(group.groupId, tab.id)} passHref>
                <Link color={theme.palette.grey[100]}> {tab.name}</Link>
              </NextLink>
            </TableCell>
          </S.TableRow>
        )
      })}
    </TableBody>
  )
}

export default AssignedIdeasTableBody
