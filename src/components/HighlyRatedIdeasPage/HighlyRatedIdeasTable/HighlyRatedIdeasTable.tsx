import AssignedIdeasTableBody from "@/components/AssignedIdeasPage/AssignedIdeasTableBody/AssignedIdeasTableBody"
import { calculateIdeaResult } from "@/components/AssignedIdeasPage/AssignedIdeasTableBody/AssignedIdeasTableRow/calculateIdeaResult/calculateIdeaResult"
import AssignedIdeasTableHead, {
  Header,
} from "@/components/AssignedIdeasPage/AssignedIdeasTableHead/AssignedIdeasTableHead"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useHighlyRatedIdeasByMeQuery from "@/hooks/react-query/domain/idea/useHighlyRatedIdeasByMeQuery"
import useUserSettingsQuery from "@/hooks/react-query/domain/user-settings/useIdeaChangesQuery"
import useHideTabsDialogStore from "@/hooks/zustand/dialogs/useHideTabsDialogStore"
import { localStorageKeys } from "@/utils/localStorageKeys"
import { useLocalStorage } from "@mantine/hooks"
import {
  Button,
  FormControlLabel,
  Paper,
  Switch,
  Tab,
  Table,
  TableContainer,
  TableFooter,
  Tabs,
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
    title: "Result (XP)",
    width: 100,
    align: "center",
  },
  {
    title: "Reward",
    width: 100,
    align: "center",
  },
  {
    title: "Discomfort Zone",
    width: 100,
    align: "center",
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

const HighlyRatedIdeasTable = (props: Props) => {
  const { data, isSuccess } = useHighlyRatedIdeasByMeQuery()

  const [showWithoutReward, setShowWithoutReward] = useState(false)
  const [minReward, setMinReward] = useLocalStorage<number>({
    key: localStorageKeys.highlyRatedPage.minReward,
    defaultValue: 0,
  })
  const [showAssignedToMeIdeas, setShowAssignedToMeIdeas] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)

  const { data: settings } = useUserSettingsQuery()

  const [sortBy, setSortBy] = useLocalStorage<
    "oldest-rated" | "highest-result"
  >({
    key: localStorageKeys.sortByHighlyRatedIdeasPage,
    defaultValue: "highest-result",
  })

  const tabIndex = useMemo(() => {
    return sortBy === "oldest-rated" ? 1 : 0
  }, [sortBy])

  const sortedIdeas = useMemo(() => {
    if (!data) {
      return []
    }

    let ideas = showCompleted
      ? data.filter((i) => i.idea.isDone)
      : data.filter((i) => !i.idea.isDone)

    if (settings?.hiddenTabsIds) {
      ideas = ideas.filter(
        (i) => !settings.hiddenTabsIds.includes(String(i.tab.tabId))
      )
    }

    if (showWithoutReward) {
      ideas = ideas.filter((i) => i.idea.rewarding === null)
    }

    if (showAssignedToMeIdeas) {
      ideas = ideas.filter((i) => i.iAmAssigned)
    }

    if (minReward > 0) {
      ideas = ideas.filter((i) => (i.idea.rewarding ?? 0) >= minReward)
    }

    if (sortBy === "oldest-rated") {
      ideas = ideas.sort((a, b) => {
        const myRatingA = a.myRating
        const myRatingB = b.myRating

        // sort by updated asc
        return myRatingA.updatedAt > myRatingB.updatedAt ? 1 : -1
      })
    }

    if (sortBy === "highest-result") {
      ideas = ideas
        .sort((a, b) => {
          const valueA = calculateIdeaResult(a.idea)
          const valueB = calculateIdeaResult(b.idea)

          if (valueA === valueB) {
            const rewardingA = a.idea.rewarding ?? 0
            const rewardingB = b.idea.rewarding ?? 0
            return rewardingA < rewardingB ? 1 : -1
          }

          return valueA < valueB ? 1 : -1
        })
        .sort((a, b) => {
          const youHighImpactVotedA = a.idea.highImpactVotes.some(
            (v) => v.userId === a.myRating.userId
          )
          const youHighImpactVotedB = b.idea.highImpactVotes.some(
            (v) => v.userId === b.myRating.userId
          )

          // the ones that have impact votes should be on top
          if (youHighImpactVotedA && !youHighImpactVotedB) return -1
          if (!youHighImpactVotedA && youHighImpactVotedB) return 1
          return 0
        })
    }

    if (showCompleted) {
      // desc
      ideas = ideas.sort((a, b) => {
        const valueA = a.idea.completedAt
        const valueB = b.idea.completedAt

        if (!valueA) return 1
        if (!valueB) return -1

        return valueA < valueB ? 1 : -1
      })
    }

    return ideas
  }, [
    data,
    data?.map((d) => d.myRating),
    showAssignedToMeIdeas,
    showCompleted,
    settings,
  ])

  const ideasWithoutRewardCount = useMemo(() => {
    return sortedIdeas.filter((i) => i.idea.rewarding === null).length
  }, [sortedIdeas])

  const assignedToMeCount = useMemo(() => {
    return sortedIdeas.filter((i) => i.iAmAssigned).length
  }, [sortedIdeas])

  const { openDialog } = useHideTabsDialogStore()

  const totalComplexityAssigned = useMemo(() => {
    return sortedIdeas.reduce((acc, assign) => {
      return acc + assign.idea.complexity
    }, 0)
  }, [sortedIdeas])

  if (!isSuccess) {
    return null
  }

  return (
    <Paper sx={{ mt: 2, background: "#2B2B2B" }}>
      <FlexVCenter flexDirection={"column"} alignItems={"start"} sx={{ pt: 1 }}>
        <FlexVCenter justifyContent={"space-between"} width="100%">
          <Typography marginLeft={"15px"} pt="10px" pb="15px" fontWeight="bold">
            Highly rated ideas
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(e, value) => {
              setSortBy(value === 0 ? "highest-result" : "oldest-rated")
            }}
            aria-label="basic tabs example"
          >
            <Tab label="Highest result" />
            <Tab label="Oldest rated" />
          </Tabs>

          <Button onClick={() => openDialog()}>Hidden tabs</Button>
        </FlexVCenter>
        <TableContainer sx={{ maxHeight: "calc(100vh - 400px)", mt: 2 }}>
          <Table stickyHeader>
            <AssignedIdeasTableHead headers={headers} />
            <AssignedIdeasTableBody
              ideas={sortedIdeas}
              showCompleted={showCompleted}
              showVotedAt
              isHighlyRatedIdeasPage
            />
          </Table>
        </TableContainer>
        <TableFooter
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            p: 1,
            pl: 2,
          }}
        >
          <FlexVCenter>Total complexity: {totalComplexityAssigned}</FlexVCenter>
          <FlexVCenter gap={2}>
            {/* <FormControlLabel
              control={
                <Switch
                  defaultChecked={showWithoutReward}
                  checked={showWithoutReward}
                  onClick={() => setShowWithoutReward(!showWithoutReward)}
                />
              }
              label={`Without reward (${ideasWithoutRewardCount})`}
            /> */}

            <MyTextField
              label="Min reward"
              type="number"
              value={minReward}
              onChange={(e) => {
                const value = e.target.value
                if (value === "") {
                  setMinReward(0)
                } else {
                  setMinReward(parseInt(value))
                }
              }}
              sx={{
                width: 100,
              }}
            />

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
              label={`Assigned to me (${assignedToMeCount})`}
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
      </FlexVCenter>
    </Paper>
  )
}

export default HighlyRatedIdeasTable
