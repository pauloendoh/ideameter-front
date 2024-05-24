import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { Box, Grid, Tooltip, Typography } from "@mui/material"
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
            step: 1,
          }}
        />

        <Box />

        <FlexVCenter gap={1}>
          <FlexCol>
            <Tooltip
              title={
                <span>
                  FREQUENCY (of pain?..) <br />
                  5. Everyday <br />
                  4. Every other day <br />
                  3. Once a week <br />
                  2. Once a month <br />
                  1. Once a year
                </span>
              }
              arrow
            >
              <span>Freq.</span>
            </Tooltip>
            <MyTextField
              type="number"
              value={props.watch("frequencyRate")}
              onChange={(e) => {
                if (e.target.value === "")
                  return props.setValue("frequencyRate", null)

                const num = Number(e.target.value)
                const min = 1
                const max = 5
                if (num < min) {
                  e.target.value = min.toString()
                }
                if (num > max) {
                  e.target.value = max.toString()
                }

                props.setValue("frequencyRate", Number(e.target.value))
              }}
              inputProps={{
                step: 1,
              }}
            />
          </FlexCol>

          <FlexCol>
            <Tooltip
              title={
                <span>
                  Improvement: o quanto pode melhorar minha experiência no meu
                  dia a dia <br />
                  5. Maybe life changing <br />
                  4. Great improvement <br />
                  3. Nice to have <br />
                  2. Yea this is a little better i guess? <br />
                  1. No?
                </span>
              }
              arrow
            >
              <span>Impr.</span>
            </Tooltip>
            <MyTextField
              type="number"
              value={props.watch("improvementRate")}
              onChange={(e) => {
                if (e.target.value === "")
                  return props.setValue("improvementRate", null)

                const num = Number(e.target.value)
                const min = 1
                const max = 5
                if (num < min) {
                  e.target.value = min.toString()
                }
                if (num > max) {
                  e.target.value = max.toString()
                }

                props.setValue("improvementRate", Number(e.target.value))
              }}
              inputProps={{
                step: 1,
              }}
            />
          </FlexCol>
        </FlexVCenter>

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
