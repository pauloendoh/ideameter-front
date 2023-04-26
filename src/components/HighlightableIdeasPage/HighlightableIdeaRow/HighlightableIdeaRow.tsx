import useIdeaHighlightsQuery from "@/hooks/react-query/domain/idea-highlight/useIdeaHighlightsQuery"
import useToggleIdeaHighlightMutation from "@/hooks/react-query/domain/idea-highlight/useToggleIdeaHighlightMutation"
import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import urls from "@/utils/urls"
import { Checkbox, Link, TableCell, TableRow } from "@mui/material"
import NextLink from "next/link"
import { useMemo } from "react"

type Props = {
  idea: IdeaDto
  index: number
}

const HighlightableIdeaRow = ({ idea, index }: Props) => {
  const { data: ideaHighlights } = useIdeaHighlightsQuery()
  const { mutate: submitToggle, isLoading } = useToggleIdeaHighlightMutation()

  const isChecked = useMemo(
    () =>
      ideaHighlights?.some((ideaHighlight) => ideaHighlight.ideaId === idea.id),
    [ideaHighlights, idea]
  )

  const { data: ideasAssignedToMe } = useAssignedToMeQuery()

  const isAssignedToMe = useMemo(
    () =>
      ideasAssignedToMe?.some(
        (ideaAssignedToMe) => ideaAssignedToMe.idea.id === idea.id
      ),
    [ideasAssignedToMe, idea]
  )

  return (
    <TableRow key={idea.id}>
      <TableCell align="center">{index + 1}</TableCell>
      <TableCell align="center">
        <Checkbox
          checked={isChecked}
          onChange={() => {
            submitToggle(idea.id)
          }}
          disabled={isLoading}
          inputProps={{ "aria-label": "controlled" }}
        />
      </TableCell>
      <TableCell align="center">{isAssignedToMe && "👍"}</TableCell>
      <TableCell>
        <NextLink
          passHref
          href={urls.pages.groupTabIdea(
            idea.tab?.group?.id as string,
            idea.tab?.id as string,
            idea.id
          )}
          style={{
            color: "unset",
          }}
        >
          <Link>{idea.name}</Link>
        </NextLink>
      </TableCell>
      <TableCell>{idea.tab?.name}</TableCell>
      <TableCell>{idea.tab?.group?.name}</TableCell>
    </TableRow>
  )
}

export default HighlightableIdeaRow
