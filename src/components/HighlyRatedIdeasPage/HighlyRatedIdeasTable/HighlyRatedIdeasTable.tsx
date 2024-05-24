import AssignedIdeasTableBody from "@/components/AssignedIdeasPage/AssignedIdeasTableBody/AssignedIdeasTableBody"
import AssignedIdeasTableHead, {
  Header,
} from "@/components/AssignedIdeasPage/AssignedIdeasTableHead/AssignedIdeasTableHead"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
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
  Tooltip,
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
    title: "RES",
    width: 100,
    align: "center",
  },
  {
    title: "Freq.",
    reactNode: (
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
    ),
    width: 100,
    align: "center",
  },
  {
    title: "Impr.",
    reactNode: (
      <Tooltip
        title={
          <span>
            Improvement: o quanto pode melhorar minha experiência no meu dia a
            dia <br />
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
    ),

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

  const [showCompleted, setShowCompleted] = useState(false)
  const [showAssignedToMeIdeas, setShowAssignedToMeIdeas] = useState(false)

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

    if (showAssignedToMeIdeas) {
      ideas = ideas.filter((i) => i.iAmAssigned)
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
      ideas = ideas.sort((a, b) => {
        const valueA =
          (a.idea.frequencyRate ?? 0) * (a.idea.improvementRate ?? 0)
        const valueB =
          (b.idea.frequencyRate ?? 0) * (b.idea.improvementRate ?? 0)

        if (valueA === valueB) {
          // sort by rating updated asc
          return a.myRating.updatedAt > b.myRating.updatedAt ? 1 : -1
        }

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
            <Tab label="Highest RES" />
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
