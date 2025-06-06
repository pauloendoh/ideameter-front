import AssignedIdeasTableBody from "@/components/AssignedIdeasPage/AssignedIdeasTableBody/AssignedIdeasTableBody"
import AssignedIdeasTableHead, {
  Header,
} from "@/components/AssignedIdeasPage/AssignedIdeasTableHead/AssignedIdeasTableHead"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useHighImpactVotedByMeQuery from "@/hooks/react-query/domain/idea/useHighImpactVotedByMeQuery"
import useUserSettingsQuery from "@/hooks/react-query/domain/user-settings/useIdeaChangesQuery"
import useHideTabsDialogStore from "@/hooks/zustand/dialogs/useHideTabsDialogStore"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableContainer,
  TableFooter,
  Typography,
} from "@mui/material"
import { useMemo, useState } from "react"

type Props = {}

const headers: Header[] = [
  {
    title: "#",
    width: 64,
    align: "center",
  },
  {
    title: "idea",
    width: 360,
    align: "left",
  },
  {
    title: "Group",
    width: 200,
    align: "left",
  },
  {
    title: "Tab",
    width: 200,
    align: "left",
  },
]

const HighImpactVotedTable = (props: Props) => {
  const { data, isSuccess } = useHighImpactVotedByMeQuery()

  const [showCompleted, setShowCompleted] = useState(false)
  const [showAssignedToMeIdeas, setShowAssignedToMeIdeas] = useState(false)

  const { data: userSettings } = useUserSettingsQuery()

  const { getAuthUserId: getUserId } = useAuthStore()

  const { openDialog } = useHideTabsDialogStore()

  const sortedIdeas = useMemo(() => {
    if (!data || !userSettings) {
      return []
    }

    let ideas = showCompleted
      ? data.filter((i) => i.idea.isDone)
      : data.filter((i) => !i.idea.isDone)

    ideas = ideas.filter(
      (i) => !userSettings.hiddenTabsIds.includes(i.tab.tabId)
    )

    if (showAssignedToMeIdeas) {
      ideas = ideas.filter((i) => i.iAmAssigned)
    }

    // sort ideas by createdAt desc
    ideas = ideas.sort((a, b) => {
      const myVoteACreatedAt =
        a.idea.highImpactVotes.find((v) => v.userId === getUserId())
          ?.createdAt || ""
      const myVoteBCreatedAt =
        b.idea.highImpactVotes.find((v) => v.userId === getUserId())
          ?.createdAt || ""

      return (
        new Date(myVoteACreatedAt).getTime() -
        new Date(myVoteBCreatedAt).getTime()
      )
    })

    return ideas
  }, [data, showAssignedToMeIdeas, showCompleted, userSettings])

  if (!isSuccess) {
    return null
  }

  return (
    <Paper sx={{ mt: 2, background: "#2B2B2B" }}>
      <Box sx={{ pt: 1 }}>
        <FlexVCenter justifyContent={"space-between"}>
          <Typography marginLeft={"15px"} pt="10px" pb="15px" fontWeight="bold">
            Quick return voted (oldest votes first)
          </Typography>

          <Button onClick={() => openDialog()}>Hidden tabs</Button>
        </FlexVCenter>
        <TableContainer sx={{ maxHeight: "calc(100vh - 400px)" }}>
          <Table stickyHeader>
            <AssignedIdeasTableHead headers={headers} />
            <AssignedIdeasTableBody
              ideas={sortedIdeas}
              showCompleted={showCompleted}
              showVotedAt
            />
          </Table>
        </TableContainer>
        <TableFooter
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            p: 1,
          }}
        >
          <FlexVCenter gap={2}>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked={showAssignedToMeIdeas}
                  checked={showAssignedToMeIdeas}
                  onClick={() =>
                    setShowAssignedToMeIdeas(!showAssignedToMeIdeas)
                  }
                />
              }
              label={`Assigned to me`}
            />

            <FormControlLabel
              control={
                <Switch
                  defaultChecked={showCompleted}
                  checked={showCompleted}
                  onClick={() => setShowCompleted(!showCompleted)}
                />
              }
              label={`Completed ideas`}
            />
          </FlexVCenter>
        </TableFooter>
      </Box>
    </Paper>
  )
}

export default HighImpactVotedTable
