import FlexCol from "@/components/_common/flexboxes/FlexCol"
import MyTextField from "@/components/_common/inputs/MyTextField"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { Box, Grid } from "@mui/material"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import CreatedUpdatedAtIdeaDialog from "../CreatedUpdatedAtIdeaDialog/CreatedUpdatedAtIdeaDialog"
import ArchiveSection from "./ArchiveSection/ArchiveSection"
import CompleteIdeaButton from "./CompleteIdeaButton/CompleteIdeaButton"
import TabSelector from "./TabSelector/TabSelector"

interface Props {
  watch: UseFormWatch<IdeaDto>
  setValue: UseFormSetValue<IdeaDto>
}

const IdeaDialogRightCol = (props: Props) => {
  const { groupId } = useRouterQueryString()
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

        <TabSelector
          valueTabId={props.watch("tabId")}
          onChange={(tabId) => props.setValue("tabId", tabId)}
        />

        <Box />

        <MyTextField
          type="number"
          label="Complexity"
          value={props.watch("complexity")}
          onChange={(e) => {
            const num = Number(e.target.value)
            const max = 5
            const min = 0
            if (num > max) {
              e.target.value = max.toString()
            } else if (num < min) {
              e.target.value = min.toString()
            }
            props.setValue("complexity", Number(e.target.value))
          }}
          inputProps={{
            step: 1,
          }}
        />

        <Box />

        {props.watch("id") && (
          <ArchiveSection
            ideaId={props.watch("id")}
            groupId={groupId}
            isArchived={props.watch("isArchived")}
            onToggleArchive={() =>
              props.setValue("isArchived", !props.watch("isArchived"))
            }
          />
        )}
      </FlexCol>
    </Grid>
  )
}

export default IdeaDialogRightCol
