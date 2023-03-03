import FlexCol from "@/components/_common/flexboxes/FlexCol"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { Box, Grid } from "@mui/material"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import CreatedUpdatedAtIdeaDialog from "../CreatedUpdatedAtIdeaDialog/CreatedUpdatedAtIdeaDialog"
import CompleteIdeaButton from "./CompleteIdeaButton/CompleteIdeaButton"
import TabSelector from "./TabSelector/TabSelector"

interface Props {
  watch: UseFormWatch<IdeaDto>
  setValue: UseFormSetValue<IdeaDto>
}

const IdeaDialogRightCol = (props: Props) => {
  return (
    <Grid item xs={4}>
      <FlexCol gap={1}>
        {props.watch("creatorId") && (
          <CreatedUpdatedAtIdeaDialog
            createdAt={props.watch("createdAt")}
            creatorId={props.watch("creatorId")}
            ideaId={props.watch("id")}
            ideaTitle={props.watch("name")}
            updatedAt={props.watch("updatedAt")}
          />
        )}

        <Box />

        <CompleteIdeaButton watch={props.watch} setValue={props.setValue} />

        <Box />
        {/* <OnFireDatePicker watch={props.watch} setValue={props.setValue} />

        <Box /> */}

        <TabSelector
          valueTabId={props.watch("tabId")}
          onChange={(tabId) => props.setValue("tabId", tabId)}
        />
      </FlexCol>
    </Grid>
  )
}

export default IdeaDialogRightCol
