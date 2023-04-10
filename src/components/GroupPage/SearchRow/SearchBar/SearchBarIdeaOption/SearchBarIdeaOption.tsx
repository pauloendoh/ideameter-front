import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import TabDto from "@/types/domain/group/tab/TabDto"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { useTheme } from "@mui/material"
import { HTMLAttributes, useMemo } from "react"
import SearchBarTabChip from "../SearchBarTabChip/SearchBarTabChip"

interface Props {
  htmlAttributes: HTMLAttributes<HTMLLIElement>
  idea: IdeaDto
  groupId?: string
  tab?: TabDto
}

const SearchBarIdeaOption = ({
  htmlAttributes,
  idea,

  groupId,
  tab,
}: Props) => {
  const theme = useTheme()

  const isDoneOrArchived = useMemo(
    () => idea.isDone || idea.isArchived,
    [idea.isDone, idea.isArchived]
  )

  return (
    <Flex
      {...(htmlAttributes as any)}
      sx={{
        textDecoration: isDoneOrArchived ? "line-through" : undefined,
        color: isDoneOrArchived ? theme.palette.grey[600] : undefined,
      }}
    >
      <Flex sx={{ width: "100%", justifyContent: "space-between", gap: 1 }}>
        <Flex>
          {idea.isDone && "✅ "}
          {idea.isArchived && "🗃️ "}
          {idea.name}
        </Flex>

        <FlexCol width="100px">
          <Flex title={tab?.name}>
            {groupId && idea.tabId && <SearchBarTabChip tab={tab} />}
          </Flex>
          <Flex gap={0.5} mt={1}>
            {idea.assignedUsers.map((u) => (
              <UserGroupAvatar
                key={u.id}
                userId={u.id}
                groupId={groupId!}
                avatarProps={{ sx: { height: 24, width: 24 } }}
                widthAndHeight={24}
              />
            ))}
          </Flex>
        </FlexCol>
      </Flex>
    </Flex>
  )
}

export default SearchBarIdeaOption
