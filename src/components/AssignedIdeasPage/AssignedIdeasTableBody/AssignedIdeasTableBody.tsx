import HighImpactVoteButton from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/IdeaTableRow/IdeaNameTableCell/HighImpactVoteIcon/HighImpactVoteButton/HighImpactVoteButton"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useMuiTheme } from "@/hooks/utils/useMuiTheme"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import urls from "@/utils/urls"
import { Link, TableBody, TableCell } from "@mui/material"
import NextLink from "next/link"
import S from "./AssignedIdeasTableBody.styles"

type Props = { ideas: AssignedToMeDto[]; showCompleted: boolean }

const AssignedIdeasTableBody = ({ ideas, showCompleted }: Props) => {
  const theme = useMuiTheme()
  const { getUserId } = useAuthStore()

  return (
    <TableBody>
      {ideas.map(({ group, tab, idea }, index) => {
        const ideaUrl = urls.pages.groupTabIdea(group.groupId, tab.id, idea.id)

        return (
          <S.TableRow
            id={idea.id}
            key={idea.id}
            className="idea-table-row"
            hover
          >
            <TableCell align="center">{index + 1}</TableCell>
            <TableCell>
              <FlexCol gap={0.5}>
                <NextLink href={ideaUrl} passHref>
                  <Link color={theme.palette.grey[100]} width="fit-content">
                    {idea.name}
                  </Link>
                </NextLink>
                <FlexVCenter justifyContent={"flex-start"}>
                  <HighImpactVoteButton
                    minWidth={0}
                    count={idea.highImpactVotes.length}
                    youVoted={idea.highImpactVotes.some(
                      (v) => v.userId === getUserId()
                    )}
                  />
                </FlexVCenter>
              </FlexCol>
            </TableCell>
            <TableCell>
              <NextLink href={urls.pages.groupId(group.groupId)} passHref>
                <Link color={theme.palette.grey[100]}> {group.name}</Link>
              </NextLink>
            </TableCell>
            <TableCell>
              <NextLink
                href={urls.pages.groupTab(group.groupId, tab.id)}
                passHref
              >
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
