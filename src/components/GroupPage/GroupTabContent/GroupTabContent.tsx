import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useNewIdeaHotkey } from "@/hooks/hotkeys/useNewIdeaHotkey/useNewIdeaHotkey"
import useTabIdeasQuery from "@/hooks/react-query/domain/group/tab/idea/useTabIdeasQuery"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import useAutoScrollStore from "@/hooks/zustand/useAutoScrollStore"
import { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import { Box, Button, FormControlLabel, FormGroup, Switch } from "@mui/material"
import { useRouter } from "next/router"
import useIdeaTableItemsQueryUtils from "../../../hooks/react-query/domain/group/useIdeaTableItemsQueryUtils"
import IdeaTable from "./IdeaTable/IdeaTable"

interface Props {
  tabId: string
  groupId: string
}

const GroupTabContent = (props: Props) => {
  const query = useRouter().query as { groupId: string }
  const { data: ideas } = useTabIdeasQuery({
    tabId: props.tabId,
    groupId: props.groupId,
  })

  const ideaRatings = useIdeaTableItemsQueryUtils(query.groupId, props.tabId)

  const { openDialog } = useIdeaDialogStore()

  const [filter, toggleOnlyCompletedIdeas, toggleGhostRatings] =
    useGroupFilterStore((s) => [
      s.filter,
      s.toggleOnlyCompletedIdeas,
      s.toggleGhostRatings,
    ])

  useNewIdeaHotkey(props.tabId)

  const [autoScrollIsDisabled, toggleAutoScroll] = useAutoScrollStore((s) => [
    s.isDisabled,
    s.toggleIsDisabled,
  ])

  const { authUser } = useAuthStore()

  return (
    <FlexCol gap={2}>
      <Box>{ideas && <IdeaTable ideaRatings={ideaRatings} />}</Box>

      <FlexVCenter ml={2} mb={1} justifyContent="space-between">
        <Button
          onClick={() => openDialog(buildIdeaDto({ tabId: props.tabId }))}
          color="primary"
          variant="contained"
        >
          + New idea (q)
        </Button>

        <FlexVCenter gap={2}>
          {authUser?.username === "pauloendoh" && (
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked={filter.onlyGhostRatings}
                    checked={filter.onlyGhostRatings}
                    onClick={() => toggleGhostRatings(props.tabId)}
                  />
                }
                label={`Ghost ratings`}
              />
            </FormGroup>
          )}

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked={filter.onlyCompletedIdeas}
                  checked={filter.onlyCompletedIdeas}
                  onClick={() => toggleOnlyCompletedIdeas(props.tabId)}
                />
              }
              label={`Completed ideas`}
            />
          </FormGroup>
          {/* <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={!autoScrollIsDisabled}
                  onClick={() => toggleAutoScroll()}
                />
              }
              label={`Auto-scroll`}
            />
          </FormGroup> */}
        </FlexVCenter>
      </FlexVCenter>
    </FlexCol>
  )
}

export default GroupTabContent
