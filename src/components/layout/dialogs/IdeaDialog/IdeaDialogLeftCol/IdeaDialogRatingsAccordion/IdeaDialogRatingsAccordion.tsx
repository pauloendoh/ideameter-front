import { OtherUserRatingCell } from "@/components/GroupPage/GroupTabContent/IdeaTable/IdeaTableRow/OtherUserRatingCell/OtherUserRatingCell"
import DisabledRatingsIcon from "@/components/GroupPage/GroupTabContent/IdeaTable/RatingInput/DisabledRatingsIcon/DisabledRatingsIcon"
import RatingInput from "@/components/GroupPage/GroupTabContent/IdeaTable/RatingInput/RatingInput"
import UserTableCell from "@/components/GroupPage/GroupTabContent/IdeaTable/UserTableCell/UserTableCell"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
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
import { useCallback, useEffect, useMemo, useState } from "react"
import { MdExpandMore } from "react-icons/md"
import useIdeaTableItemsQueryUtils from "../../../../../../hooks/react-query/domain/group/useIdeaTableItemsQueryUtils"
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
  const allTableItems = useIdeaTableItemsQueryUtils(props.groupId, props.tabId)

  const [expanded, setExpanded] = useState(props.initialRatingsAreEnabled)
  useEffect(() => {
    setExpanded(props.initialRatingsAreEnabled)
  }, [props.initialRatingsAreEnabled])

  const authUserId = useAuthStore((s) => s.authUserId)

  const tableItem = useMemo(() => {
    return allTableItems.find((r) => r.idea.id === props.ideaId)
  }, [allTableItems, props.ideaId])

  const theme = useTheme()

  // It was not re-rendering when the props.ideaId was changing!
  const LocalRatingInput = useCallback(() => {
    if (!tableItem) {
      return null
    }
    return (
      <RatingInput
        idea={tableItem.idea}
        groupId={props.groupId}
        isDisabled={!props.ratingsAreEnabled}
      />
    )
  }, [
    props.ideaId,
    tableItem?.idea,
    props.groupId,
    props.initialRatingsAreEnabled,
  ])

  const buttonLabel = useMemo(() => {
    const initialEnabled = props.initialRatingsAreEnabled
    const currentEnabled = props.ratingsAreEnabled

    if (initialEnabled && currentEnabled) {
      return "Clear and disable ratings"
    }
    if (initialEnabled && !currentEnabled) {
      return "Ratings will be cleared and disabled after saving. Click to undo."
    }

    if (!initialEnabled && !currentEnabled) {
      return "Ratings are disabled. Click to re-enable"
    }

    if (!initialEnabled && currentEnabled) {
      return "Ratings will be enabled after saving. Click to undo."
    }
  }, [props.ratingsAreEnabled, props.initialRatingsAreEnabled])

  const titleLabel = useMemo(() => {
    if (props.ratingsAreEnabled && tableItem) {
      return `Ratings - Avg ${upToNDecimals(Number(tableItem.avgRating), 1)}`
    }

    return "Ratings disabled"
  }, [props.ratingsAreEnabled, tableItem])

  const filter = useGroupFilterStore((s) => s.filter)
  const otherUserGroupRatings = useMemo(() => {
    if (!tableItem) {
      return []
    }
    if (filter.onlyShowRatingsByMemberIds.length === 0) {
      return tableItem.otherUserGroupRatings
    }

    return tableItem.otherUserGroupRatings.filter((r) =>
      filter.onlyShowRatingsByMemberIds.includes(r.userGroup.userId)
    )
  }, [tableItem, filter.onlyShowRatingsByMemberIds])

  const shouldShowYourRating = useMemo(() => {
    if (!tableItem) {
      return false
    }
    if (filter.onlyShowRatingsByMemberIds.length === 0) {
      return true
    }
    return filter.onlyShowRatingsByMemberIds.includes(authUserId)
  }, [tableItem, filter.onlyShowRatingsByMemberIds, authUserId])

  if (!tableItem) {
    return null
  }

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
              {shouldShowYourRating && (
                <UserTableCell userId={authUserId} isYou />
              )}

              {otherUserGroupRatings.map((gr) => (
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
              {shouldShowYourRating && (
                <TableCell align="center">
                  <LocalRatingInput />
                </TableCell>
              )}

              {otherUserGroupRatings.map((otherUserRating) => {
                if (props.initialRatingsAreEnabled) {
                  return (
                    <OtherUserRatingCell
                      ideaRating={tableItem}
                      theirRating={otherUserRating}
                      key={`${OtherUserRatingCell.name}-${tableItem.idea.id}-${otherUserRating.userGroup.userId}`}
                    />
                  )
                }

                return (
                  <DisabledRatingsIcon key={JSON.stringify(otherUserRating)} />
                )
              })}

              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </AccordionDetails>
    </S.Accordion>
  )
}

export default IdeaDialogRatingsAccordion
