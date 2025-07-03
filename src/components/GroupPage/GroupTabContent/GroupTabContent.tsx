import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useTabIdeasQuery from "@/hooks/react-query/domain/group/tab/idea/useTabIdeasQuery"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import { Box, FormControlLabel, FormGroup, Switch } from "@mui/material"
import { useRouter } from "next/router"
import useIdeaTableItemsQueryUtils from "../../../hooks/react-query/domain/group/useIdeaTableItemsQueryUtils"
import IdeaTable from "./IdeaTable/IdeaTable"
import { NewIdeaMenuButton } from "./NewIdeaMenuButton/NewIdeaMenuButton"

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

  const [filter, toggleOnlyCompletedIdeas, toggleGhostRatings] =
    useGroupFilterStore((s) => [
      s.filter,
      s.toggleOnlyCompletedIdeas,
      s.toggleGhostRatings,
    ])

  return (
    <FlexCol gap={2}>
      <Box>{ideas && <IdeaTable ideaRatings={ideaRatings} />}</Box>

      <FlexVCenter ml={2} mb={1} justifyContent="space-between">
        <NewIdeaMenuButton tabId={props.tabId} />

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
