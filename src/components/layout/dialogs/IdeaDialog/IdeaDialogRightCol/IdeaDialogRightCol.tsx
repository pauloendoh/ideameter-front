import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import Txt from "@/components/_common/text/Txt"
import useIdeaAssignmentStore from "@/hooks/zustand/dialogs/useIdeaAssignmentStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { Grid } from "@mui/material"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import { AiOutlineUserAdd } from "react-icons/ai"
import CompleteIdeaButton from "./CompleteIdeaButton/CompleteIdeaButton"
import HighImpactVoteButton from "./HighImpactVoteButton/HighImpactVoteButton"
import OnFireDatePicker from "./OnFireDatePicker/OnFireDatePicker"

interface Props {
  watch: UseFormWatch<IdeaDto>
  setValue: UseFormSetValue<IdeaDto>
}

const IdeaDialogRightCol = (props: Props) => {
  const openAssignDialog = useIdeaAssignmentStore((s) => s.openDialog)

  return (
    <Grid item xs={4}>
      <FlexCol gap={1}>
        <Txt>Add to idea</Txt>

        <CompleteIdeaButton watch={props.watch} setValue={props.setValue} />

        <DarkButton
          startIcon={<AiOutlineUserAdd />}
          sx={{ justifyContent: "flex-start", pl: 2 }}
          onClick={() =>
            openAssignDialog(props.watch("assignedUsers"), (val) =>
              props.setValue("assignedUsers", val)
            )
          }
        >
          Assign members
        </DarkButton>

        <OnFireDatePicker watch={props.watch} setValue={props.setValue} />
        <HighImpactVoteButton watch={props.watch} setValue={props.setValue} />
      </FlexCol>
    </Grid>
  )
}

export default IdeaDialogRightCol
