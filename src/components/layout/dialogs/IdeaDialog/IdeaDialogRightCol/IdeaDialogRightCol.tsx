import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { Box, Grid, Typography } from "@mui/material"
import { useMemo } from "react"
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
  const { data: groups } = useGroupsQuery()
  const group = useMemo(() => {
    return groups?.find((g) => g.id === groupId)
  }, [groups, groupId])
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

        <Typography>Group: {group?.name}</Typography>

        <Box />

        <TabSelector
          valueTabId={props.watch("tabId")}
          onChange={(tabId) => props.setValue("tabId", tabId)}
        />

        <Box />

        <FlexVCenter gap={2}>
          <MyTextField
            type="number"
            label="My interest"
            value={props.watch("rewarding")}
            onChange={(e) => {
              if (e.target.value === "") {
                return props.setValue("rewarding", null)
              }
            }}
            inputProps={{
              step: 0.1,
            }}
            sx={{
              maxWidth: "140px",
            }}
          />

          <MyTextField
            type="number"
            label="Discomfort Zone"
            value={props.watch("discomfortZone")}
            onChange={(e) => {
              if (e.target.value === "")
                return props.setValue("discomfortZone", null)

              const num = Number(e.target.value)
              const min = 1
              const max = 5
              if (num < min) {
                e.target.value = min.toString()
              }
              if (num > max) {
                e.target.value = max.toString()
              }

              props.setValue("discomfortZone", Number(e.target.value))
            }}
            inputProps={{
              step: 0.1,
            }}
            sx={{
              maxWidth: "140px",
            }}
          />
        </FlexVCenter>

        <Box />

        {/* <FlexVCenter gap={2}>
          <MyTextField
            type="number"
            label="Complexity"
            value={props.watch("complexity")}
            onChange={(e) => {
              const num = Number(e.target.value)
              const min = 0
              if (num < min) {
                e.target.value = min.toString()
              }
              props.setValue("complexity", Number(e.target.value))
            }}
            inputProps={{
              step: 0.1,
            }}
          />
        </FlexVCenter>

        <Box /> */}

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
