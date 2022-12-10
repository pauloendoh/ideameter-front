import RatingInput from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/RatingInput/RatingInput"
import UserTableCell from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/UserTableCell/UserTableCell"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import {
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material"
import { useCallback, useMemo, useState } from "react"
import { MdExpandMore } from "react-icons/md"
import useIdeaRatingsQueryUtils from "../../../../../../hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import S from "./IdeaDialogRatingsAccordion.styles"

interface Props {
  ideaId: string
  groupId: string
  tabId: string
}

const ariaLabel = `ratings-accordion`

const IdeaDialogRatingsAccordion = (props: Props) => {
  const tabRatings = useIdeaRatingsQueryUtils(props.groupId, props.tabId)

  const [expanded, setExpanded] = useState(false)

  const authUser = useAuthStore((s) => s.authUser)

  const ideaRatings = useMemo(() => {
    const ideaRating = tabRatings.find((r) => r.idea.id === props.ideaId)

    return ideaRating
  }, [tabRatings, props.ideaId])

  const theme = useTheme()

  // It was not re-rendering when the props.ideaId was changing!
  const LocalRatingInput = useCallback(() => {
    if (!ideaRatings) return null
    return <RatingInput idea={ideaRatings.idea} groupId={props.groupId} />
  }, [props.ideaId, ideaRatings?.idea, props.groupId])

  if (!ideaRatings) return null

  return (
    <S.Accordion
      expanded={expanded}
      sx={{
        "&.MuiAccordion-root": {
          background: "transparent",
          boxShadow: "none",
          borderTop: `1px solid ${theme.palette.grey[700]}`,
          mb: 0,
        },
        ".MuiAccordionSummary-root": {
          minHeight: "unset",
          px: 0,
        },
      }}
    >
      <AccordionSummary
        onClick={() => setExpanded(!expanded)}
        expandIcon={<MdExpandMore />}
        aria-controls={`${ariaLabel}-head`}
        id={`${ariaLabel}-head`}
        sx={{
          minHeight: "unset !important",
          ".MuiAccordionSummary-content": {
            margin: "16px 0 8px !important",
          },
        }}
      >
        <Typography>Ratings - Avg {ideaRatings.avgRating}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pb: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <UserTableCell userId={authUser!.id} isYou />
              {ideaRatings.otherUserGroupRatings.map((gr) => (
                <UserTableCell key={gr.userGroup.userId} userId={gr.userGroup.userId} />
              ))}

              {/* Empty cell to avoid bigger width on the last cell */}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="center">
                <LocalRatingInput />
              </TableCell>
              {ideaRatings.otherUserGroupRatings.map((userGroupRating) => (
                <TableCell key={JSON.stringify(userGroupRating)} align="center">
                  {userGroupRating.rating}
                </TableCell>
              ))}

              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </AccordionDetails>
    </S.Accordion>
  )
}

export default IdeaDialogRatingsAccordion
