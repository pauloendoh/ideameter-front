import FlexCol from "@/components/_common/flexboxes/FlexCol"
import Txt from "@/components/_common/text/Txt"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { Grid } from "@mui/material"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import CompleteIdeaButton from "./CompleteIdeaButton/CompleteIdeaButton"
import OnFireDatePicker from "./OnFireDatePicker/OnFireDatePicker"

interface Props {
  watch: UseFormWatch<IdeaDto>
  setValue: UseFormSetValue<IdeaDto>
}

const IdeaDialogRightCol = (props: Props) => {
  return (
    <Grid item xs={4}>
      <FlexCol gap={1}>
        <Txt>Add to idea</Txt>

        <CompleteIdeaButton watch={props.watch} setValue={props.setValue} />

        <OnFireDatePicker watch={props.watch} setValue={props.setValue} />
      </FlexCol>
    </Grid>
  )
}

export default IdeaDialogRightCol
