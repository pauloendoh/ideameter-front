import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useSubideaRatingsQueryUtils from "@/hooks/react-query/domain/rating/useSubideaRatingsQueryUtils"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useSubideaDialogStore from "@/hooks/zustand/dialogs/useSubideaDialogStore"
import { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Switch,
  Typography,
  useTheme,
} from "@mui/material"
import { useMemo, useState } from "react"
import { MdExpandMore } from "react-icons/md"
import SubideasTable from "../SubideasTable/SubideasTable"

interface Props {
  ideaId: string
}

const ariaLabel = `subideas-accordion`

const IdeaDialogSubideasAccordion = (props: Props) => {
  const openSubideaDialog = useSubideaDialogStore((s) => s.openDialog)
  const [expanded, setExpanded] = useState(true)

  const { groupId } = useRouterQueryString()

  const { data: subideaRatings, isLoading } = useSubideaRatingsQueryUtils(
    props.ideaId,
    groupId
  )

  const [showCompleted, setShowCompleted] = useState(false)

  const visibleSubideaRatings = useMemo(() => {
    if (showCompleted) return subideaRatings.filter((r) => r.idea.isDone)

    return subideaRatings.filter((r) => !r.idea.isDone)
  }, [showCompleted, subideaRatings])

  const completedSubideas = useMemo(
    () => subideaRatings.filter((r) => r.idea.isDone),
    [subideaRatings]
  )

  const theme = useTheme()

  return (
    <Accordion
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
        <Typography>Subideas</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pb: 0 }}>
        <SubideasTable
          isLoading={isLoading}
          subideasTableItems={visibleSubideaRatings}
        />

        <FlexVCenter justifyContent={"space-between"}>
          <DarkButton
            sx={{ width: 150, mt: 2 }}
            onClick={() => {
              openSubideaDialog(buildIdeaDto({ parentId: props.ideaId }))
            }}
          >
            + Add subidea
          </DarkButton>

          {completedSubideas.length > 0 && (
            <FormControlLabel
              control={
                <Switch
                  defaultChecked={showCompleted}
                  checked={showCompleted}
                  onClick={() => setShowCompleted(!showCompleted)}
                />
              }
              label={`Completed subideas`}
            />
          )}
        </FlexVCenter>
      </AccordionDetails>
    </Accordion>
  )
}

export default IdeaDialogSubideasAccordion
