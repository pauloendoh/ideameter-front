import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { useNewIdeaHotkey } from "@/hooks/hotkeys/useNewIdeaHotkey/useNewIdeaHotkey"
import useTabIdeasQuery from "@/hooks/react-query/domain/group/tab/idea/useTabIdeasQuery"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import useAutoScrollStore from "@/hooks/zustand/useAutoScrollStore"
import { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import { Box, Button, FormControlLabel, FormGroup, Switch } from "@mui/material"
import { useRouter } from "next/router"
import useIdeaRatingsQueryUtils from "../../../hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
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

  const ideaRatings = useIdeaRatingsQueryUtils(query.groupId, props.tabId)

  const { openDialog } = useIdeaDialogStore()

  const [filter, toggleOnlyCompletedIdeas] = useGroupFilterStore((s) => [
    s.filter,
    s.toggleOnlyCompletedIdeas,
  ])

  useNewIdeaHotkey(props.tabId)

  const [autoScrollIsDisabled, toggleAutoScroll] = useAutoScrollStore((s) => [
    s.isDisabled,
    s.toggleIsDisabled,
  ])

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
