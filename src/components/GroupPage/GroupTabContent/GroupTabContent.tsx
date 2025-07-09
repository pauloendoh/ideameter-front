import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useNewIdeaHotkey } from "@/hooks/hotkeys/useNewIdeaHotkey/useNewIdeaHotkey"
import useTabIdeasQuery from "@/hooks/react-query/domain/group/tab/idea/useTabIdeasQuery"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
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

  return (
    <FlexCol gap={2}>
      <Box>{ideas && <IdeaTable ideaRatings={ideaRatings} />}</Box>

      <FlexVCenter ml={2} mb={1} justifyContent="space-between">
        {/* <NewIdeaMenuButton tabId={props.tabId} /> */}

        <Button
          onClick={() => openDialog(buildIdeaDto({ tabId: props.tabId }))}
          color="primary"
          variant="contained"
        >
          + New idea (q)
        </Button>

        <FlexVCenter gap={2}>
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
        </FlexVCenter>
      </FlexVCenter>
    </FlexCol>
  )
}

export default GroupTabContent
