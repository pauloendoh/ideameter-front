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
import { MdInfo } from "react-icons/md"

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
    title: "R^C",
    reactNode: (
      <Tooltip
        title={
          <div>
            <span>High rating ^ complexity</span>
            <br />
            <ol>
              <li>
                You spend more time doing things that are more interesting
              </li>
              <li>You learn more</li>
              <li>You have a more significant result, most of the time</li>
            </ol>
          </div>
        }
      >
        <div>
          R^C <MdInfo />
        </div>
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

  const [sortBy, setSortBy] = useLocalStorage<"oldest-rated" | "highest-ratio">(
    {
      key: localStorageKeys.sortByHighlyRatedIdeasPage,
      defaultValue: "oldest-rated",
    }
  )

  const tabIndex = useMemo(() => {
    return sortBy === "oldest-rated" ? 0 : 1
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

    if (sortBy === "highest-ratio") {
      ideas = ideas.sort((a, b) => {
        const valueA = Math.pow(a.myRating.rating ?? 0, a.idea.complexity)
        const valueB = Math.pow(b.myRating.rating ?? 0, b.idea.complexity)

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
              setSortBy(value === 0 ? "oldest-rated" : "highest-ratio")
            }}
            aria-label="basic tabs example"
          >
            <Tab label="Oldest rated" />
            <Tab label="Highest R^C" />
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
