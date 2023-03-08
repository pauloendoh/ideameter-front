import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import useGroupIdeasQuery from "@/hooks/react-query/domain/group/idea/useGroupIdeasQuery"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { Typography, useTheme } from "@mui/material"
import { HTMLAttributes, useMemo } from "react"

interface Props {
  htmlAttributes: HTMLAttributes<HTMLLIElement>
  idea: IdeaDto
  groupId: string
}

const SearchBarSubideaOption = ({ htmlAttributes, idea, groupId }: Props) => {
  const theme = useTheme()
  const { data: ideas } = useGroupIdeasQuery(groupId!)
  const parentIdea = useMemo(
    () => ideas?.find((i) => i.id === idea.parentId),
    [ideas, idea.parentId]
  )

  return (
    <Flex {...(htmlAttributes as any)} width="100%">
      <FlexCol alignItems="flex-start" width="100%">
        <Flex
          width="100%"
          sx={{
            textDecoration: idea.isDone ? "line-through" : undefined,
            color: idea.isDone ? theme.palette.grey[600] : undefined,
          }}
        >
          {idea.name}
        </Flex>

        <Flex justifyContent={"flex-end"} width="100%">
          <Typography
            sx={{
              fontStyle: "italic",
              color: theme.palette.grey[600],
              width: 180,
            }}
            title={parentIdea?.name}
            noWrap
          >
            {parentIdea?.name}
          </Typography>
        </Flex>
      </FlexCol>
    </Flex>
  )
}

export default SearchBarSubideaOption
