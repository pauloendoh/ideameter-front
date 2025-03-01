import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { pluralize } from "@/utils/text/pluralize"
import urls from "@/utils/urls"
import { Box, Grid, Tooltip, Typography } from "@mui/material"
import { useMemo } from "react"
import { UseFormSetValue, UseFormWatch } from "react-hook-form"
import CreatedUpdatedAtIdeaDialog from "../CreatedUpdatedAtIdeaDialog/CreatedUpdatedAtIdeaDialog"
import ArchiveSection from "./ArchiveSection/ArchiveSection"
import CompleteIdeaButton from "./CompleteIdeaButton/CompleteIdeaButton"
import TabSelector from "./TabSelector/TabSelector"
import WaitingIdeasSection from "./WaitingIdeasSection/WaitingIdeasSection"

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

  const { authUser } = useAuthStore()

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

        {authUser?.username === "pauloendoh" && (
          <>
            <FlexVCenter gap={2}>
              <MyTextField
                type="number"
                label="My interest"
                value={props.watch("rewarding")}
                onChange={(e) => {
                  if (e.target.value === "") {
                    return props.setValue("rewarding", null)
                  }

                  props.setValue("hasChangedRewardingOrDiscomfort", true)

                  return props.setValue("rewarding", Number(e.target.value))
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
                  if (e.target.value === "") {
                    return props.setValue("discomfortZone", null)
                  }

                  props.setValue("hasChangedRewardingOrDiscomfort", true)

                  const num = Number(e.target.value)
                  const min = 1
                  const max = 5
                  if (num < min) {
                    e.target.value = min.toString()
                  }
                  if (num > max) {
                    e.target.value = max.toString()
                  }

                  props.setValue("discomfortZone", parseInt(e.target.value))
                }}
                sx={{
                  maxWidth: "140px",
                }}
              />
            </FlexVCenter>

            <Box />
          </>
        )}

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

        <Box />
        {props.watch("beingWaitedFor").length > 0 && (
          <Typography component="span" color="orange">
            Being waited by{" "}
            <Tooltip
              arrow
              title={
                <ul
                  style={{
                    paddingLeft: 16,
                    paddingRight: 8,
                  }}
                >
                  {props.watch("beingWaitedFor").map((idea) => (
                    <li key={idea.id}>
                      <a
                        href={urls.pages.groupTabIdea(
                          groupId,
                          idea.tabId,
                          idea.id
                        )}
                        target="_blank"
                        style={{
                          color: "unset",
                          textDecoration: idea.isDone
                            ? "line-through"
                            : "unset",
                          opacity: idea.isDone ? 0.5 : 1,
                        }}
                      >
                        <Typography key={idea.id}>
                          {idea.name}

                          {idea.isDone}
                        </Typography>
                      </a>
                    </li>
                  ))}
                </ul>
              }
            >
              <Typography
                component="span"
                style={{
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {props.watch("beingWaitedFor").length}{" "}
                {pluralize({
                  count: props.watch("beingWaitedFor").length,
                  word: "idea",
                })}
              </Typography>
            </Tooltip>
          </Typography>
        )}
        <WaitingIdeasSection setValue={props.setValue} watch={props.watch} />
      </FlexCol>
    </Grid>
  )
}

export default IdeaDialogRightCol
