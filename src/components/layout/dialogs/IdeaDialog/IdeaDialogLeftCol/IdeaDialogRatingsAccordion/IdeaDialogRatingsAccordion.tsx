import DisabledRatingsIcon from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/RatingInput/DisabledRatingsIcon/DisabledRatingsIcon"
import RatingInput from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/RatingInput/RatingInput"
import UserTableCell from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/UserTableCell/UserTableCell"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import {
  AccordionDetails,
  AccordionSummary,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material"
import { upToNDecimals } from "endoh-utils"
import { useCallback, useMemo, useState } from "react"
import { MdExpandMore } from "react-icons/md"
import useIdeaRatingsQueryUtils from "../../../../../../hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import S from "./IdeaDialogRatingsAccordion.styles"

interface Props {
  ideaId: string
  groupId: string
  tabId: string
  initialRatingsAreEnabled: boolean
  ratingsAreEnabled: boolean
  onChangeRatingsAreEnabled: (ratingsAreEnabled: boolean) => void
}

const ariaLabel = `ratings-accordion`

const IdeaDialogRatingsAccordion = (props: Props) => {
  const tabRatings = useIdeaRatingsQueryUtils(props.groupId, props.tabId)

  const [expanded, setExpanded] = useState(true)

  const authUser = useAuthStore((s) => s.authUser)

  const ideaRatings = useMemo(() => {
    const ideaRating = tabRatings.find((r) => r.idea.id === props.ideaId)

    return ideaRating
  }, [tabRatings, props.ideaId])

  const theme = useTheme()

  // It was not re-rendering when the props.ideaId was changing!
  const LocalRatingInput = useCallback(() => {
    if (!ideaRatings) return null
    return (
      <RatingInput
        idea={ideaRatings.idea}
        groupId={props.groupId}
        isDisabled={!props.ratingsAreEnabled}
      />
    )
  }, [
    props.ideaId,
    ideaRatings?.idea,
    props.groupId,
    props.initialRatingsAreEnabled,
  ])

  const buttonLabel = useMemo(() => {
    const initialEnabled = props.initialRatingsAreEnabled
    const currentEnabled = props.ratingsAreEnabled

    if (initialEnabled && currentEnabled) return "Clear and disable ratings"
    if (initialEnabled && !currentEnabled)
      return "Ratings will be cleared and disabled after saving. Click to undo."

    if (!initialEnabled && !currentEnabled)
      return "Ratings are disabled. Click to re-enable"
    if (!initialEnabled && currentEnabled)
      return "Ratings will be enabled after saving. Click to undo."
  }, [props.ratingsAreEnabled, props.initialRatingsAreEnabled])

  const titleLabel = useMemo(() => {
    if (props.ratingsAreEnabled && ideaRatings) {
      return `Ratings - Avg ${upToNDecimals(Number(ideaRatings.avgRating), 1)}`
    }

    return "Ratings disabled"
  }, [props.ratingsAreEnabled, ideaRatings])

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
          flexDirection: "row-reverse",
          gap: 1,
          minHeight: "unset !important",
          ".MuiAccordionSummary-content": {
            margin: "12px 0 8px !important",
          },
        }}
      >
        <FlexVCenter flex={1}>
          <Typography flex={1}>{titleLabel}</Typography>
          <Button
            color="error"
            onClick={(e) => {
              e.stopPropagation()
              props.onChangeRatingsAreEnabled(!props.ratingsAreEnabled)
            }}
            variant={
              props.initialRatingsAreEnabled !== props.ratingsAreEnabled
                ? "contained"
                : "text"
            }
          >
            {buttonLabel}
          </Button>
        </FlexVCenter>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pb: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <UserTableCell userId={authUser!.id} isYou />
              {ideaRatings.otherUserGroupRatings.map((gr) => (
                <UserTableCell
                  key={gr.userGroup.userId}
                  userId={gr.userGroup.userId}
                />
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
                  {!props.initialRatingsAreEnabled ? (
                    <DisabledRatingsIcon />
                  ) : (
                    userGroupRating.rating
                  )}
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
