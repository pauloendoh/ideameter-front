import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import useSubideaDialogStore from "@/hooks/zustand/dialogs/useSubideaDialogStore"
import { newIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  useTheme,
} from "@mui/material"
import { useState } from "react"
import { MdExpandMore } from "react-icons/md"
import SubideasTable from "../SubideasTable/SubideasTable"

interface Props {
  ideaId: string
}

const ariaLabel = `subideas-accordion`

const IdeaDialogSubideasAccordion = (props: Props) => {
  const openSubideaDialog = useSubideaDialogStore((s) => s.openDialog)
  const [expanded, setExpanded] = useState(true)

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
          minHeight: "unset !important",
          ".MuiAccordionSummary-content": {
            margin: "16px 0 8px !important",
          },
        }}
      >
        <Typography>Subideas</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pb: 0 }}>
        <SubideasTable parentId={props.ideaId} />
        <DarkButton
          sx={{ width: 150, mt: 2 }}
          onClick={() => {
            openSubideaDialog(newIdeaDto({ parentId: props.ideaId }))
          }}
        >
          Create subideas
        </DarkButton>
      </AccordionDetails>
    </Accordion>
  )
}

export default IdeaDialogSubideasAccordion
