import AssignedIdeasTableBody from "@/components/AssignedIdeasPage/AssignedIdeasTableBody/AssignedIdeasTableBody"
import { calculateIdeaResult } from "@/components/AssignedIdeasPage/AssignedIdeasTableBody/AssignedIdeasTableRow/calculateIdeaResult/calculateIdeaResult"
import AssignedIdeasTableHead from "@/components/AssignedIdeasPage/AssignedIdeasTableHead/AssignedIdeasTableHead"
import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useHighlyRatedIdeasByMeQuery from "@/hooks/react-query/domain/idea/useHighlyRatedIdeasByMeQuery"
import useUserSettingsQuery from "@/hooks/react-query/domain/user-settings/useIdeaChangesQuery"
import useHideTabsDialogStore from "@/hooks/zustand/dialogs/useHideTabsDialogStore"
import { useMyRatedIdeasStore } from "@/hooks/zustand/domain/my-rated-ideas/useMyRatedIdeasStore"
import { localStorageKeys } from "@/utils/localStorageKeys"
import { useLocalStorage } from "@mantine/hooks"
import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Table,
  TableContainer,
  TableFooter,
  Tabs,
  Typography,
} from "@mui/material"
import { textContainsWords } from "endoh-utils"
import { DateTime } from "luxon"
import { useMemo, useState } from "react"
import { useMyRatedIdeasTableHeaders } from "./useMyRatedIdeasTableHeaders/useMyRatedIdeasTableHeaders"

type Props = {}

const HighlyRatedIdeasTable = (props: Props) => {
  const { data, isSuccess } = useHighlyRatedIdeasByMeQuery()

  const [hideRecent, setHideRecent] = useState(false)
  const [minReward, setMinReward] = useLocalStorage<number>({
    key: localStorageKeys.highlyRatedPage.minReward,
    defaultValue: 0,
  })
  const [showAssignedToMeIdeas, setShowAssignedToMeIdeas] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [onlyNoXp, setOnlyNoXp] = useState(false)

  type RequiresChangeFilterType =
    | "show all"
    | "requires change"
    | "already changed"
  const [requiresChangeFilter, setRequiresChangeFilter] =
    useLocalStorage<RequiresChangeFilterType>({
      key: localStorageKeys.highlyRatedPage.requiresChangeFilter,
      defaultValue: "show all",
    })

  type WaitingIdeasFilterType =
    | "none"
    | "hide ideas waiting ideas"
    | "waiting for idea"
    | "being waited for"
    | "being waited for and not waiting"

  const [waitingForIdeasFilter, setWaitingForIdeasFilter] =
    useLocalStorage<WaitingIdeasFilterType>({
      key: localStorageKeys.highlyRatedPage.ideasWaitingIdeasFilter,
      defaultValue: "hide ideas waiting ideas",
    })
  const [labelsFilter, setLabelsFilter] = useState("")

  const { data: settings } = useUserSettingsQuery()

  const [sortBy, setSortBy] = useLocalStorage<"oldest-rated" | "custom-sort">({
    key: localStorageKeys.sortByHighlyRatedIdeasPage,
    defaultValue: "custom-sort",
  })

  const tabIndex = useMemo(() => {
    return sortBy === "oldest-rated" ? 1 : 0
  }, [sortBy])

  const { sortingBy: customSortingBy } = useMyRatedIdeasStore()

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

    if (onlyNoXp) {
      ideas = ideas.filter((i) => {
        const value = calculateIdeaResult(i.idea)
        return value === 0
      })
    }

    if (minReward > 0) {
      ideas = ideas.filter((i) => (i.idea.rewarding ?? 0) >= minReward)
    }

    if (hideRecent) {
      ideas = ideas.filter((i) => {
        const youHighImpactVotedA = i.idea.highImpactVotes.some(
          (v) => v.userId === i.myRating.userId
        )
        if (youHighImpactVotedA) return true
        const now = DateTime.now()
        const createdAt = DateTime.fromISO(i.idea.createdAt)

        return now.diff(createdAt, "days").days > 14
      })
    }

    if (sortBy === "oldest-rated") {
      ideas = ideas.sort((a, b) => {
        const myRatingA = a.myRating
        const myRatingB = b.myRating

        // sort by updated asc
        return myRatingA.updatedAt > myRatingB.updatedAt ? 1 : -1
      })
    }

    if (waitingForIdeasFilter === "hide ideas waiting ideas") {
      ideas = ideas.filter(
        (i) => i.idea.waitingIdeas.filter((w) => !w.isDone).length === 0
      )
    }

    if (waitingForIdeasFilter === "waiting for idea") {
      ideas = ideas.filter(
        (i) => i.idea.waitingIdeas.filter((w) => !w.isDone).length > 0
      )
    }
    if (waitingForIdeasFilter === "being waited for") {
      ideas = ideas.filter((i) => i.idea.beingWaitedFor.length > 0)
    }

    if (waitingForIdeasFilter === "being waited for and not waiting") {
      ideas = ideas.filter(
        (i) =>
          i.idea.beingWaitedFor.length > 0 &&
          i.idea.waitingIdeas.filter((w) => !w.isDone).length === 0
      )
    }

    if (!!labelsFilter) {
      ideas = ideas.filter((i) =>
        i.idea.labels.some((l) => textContainsWords(l.name, labelsFilter))
      )
    }

    if (sortBy === "custom-sort") {
      ideas = [...ideas]
        .sort((a, b) => {
          const rewardingA = a.idea.rewarding ?? 0
          const rewardingB = b.idea.rewarding ?? 0

          const discomfortA = a.idea.discomfortZone ?? 0
          const discomfortB = b.idea.discomfortZone ?? 0

          if (customSortingBy === "result") {
            const valueA = calculateIdeaResult(a.idea)
            const valueB = calculateIdeaResult(b.idea)

            if (valueA === valueB) {
              return rewardingA < rewardingB ? 1 : -1
            }

            return valueA < valueB ? 1 : -1
          }

          if (customSortingBy === "reward") {
            if (rewardingA === rewardingB) {
              // discomfort asc
              return discomfortA > discomfortB ? 1 : -1
            }
            return rewardingA < rewardingB ? 1 : -1
          }

          if (customSortingBy === "discomfort") {
            if (discomfortA === discomfortB) {
              // rewarding desc
              return rewardingA > rewardingB ? -1 : 1
            }

            // discomfort asc
            return discomfortA > discomfortB ? 1 : -1
          }

          return 0
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

    if (requiresChangeFilter === "requires change") {
      ideas = ideas.filter(
        (i) => i.idea.hasChangedRewardingOrDiscomfort === false
      )
    }

    if (requiresChangeFilter === "already changed") {
      ideas = ideas.filter(
        (i) => i.idea.hasChangedRewardingOrDiscomfort === true
      )
    }

    return ideas
  }, [
    data,
    data?.map((d) => d.myRating),
    showAssignedToMeIdeas,
    showCompleted,
    settings,
    hideRecent,
    customSortingBy,
  ])

  const assignedToMeCount = useMemo(() => {
    return sortedIdeas.filter((i) => i.iAmAssigned).length
  }, [sortedIdeas])

  const { openDialog } = useHideTabsDialogStore()

  const headers = useMyRatedIdeasTableHeaders()

  if (!isSuccess) {
    return null
  }

  return (
    <Paper sx={{ mt: 2, background: "#2B2B2B" }}>
      <FlexVCenter flexDirection={"column"} alignItems={"start"} sx={{ pt: 1 }}>
        <FlexVCenter justifyContent={"space-between"} width="100%">
          <Typography marginLeft={"15px"} pt="10px" pb="15px" fontWeight="bold">
            Highly rated ideas ({sortedIdeas.length}/{data.length})
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(e, value) => {
              setSortBy(value === 0 ? "custom-sort" : "oldest-rated")
            }}
            aria-label="basic tabs example"
          >
            <Tab label="Custom sort" />
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
            p: 1,
            pl: 2,
          }}
        >
          <FlexCol gap={2}>
            <FlexVCenter justifyContent={"space-between"}>
              <FlexVCenter gap={2}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      defaultChecked={hideRecent}
                      checked={hideRecent}
                      onClick={() => setHideRecent(!hideRecent)}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Hide recent (15 days)
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      defaultChecked={onlyNoXp}
                      checked={onlyNoXp}
                      onClick={() => setOnlyNoXp(!onlyNoXp)}
                    />
                  }
                  label={<Typography variant="body2">No XP</Typography>}
                />
              </FlexVCenter>
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
                  defaultValue={minReward}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "") {
                      setMinReward(0)
                    } else {
                      const num = Number(value)
                      setMinReward(num)
                    }
                  }}
                  sx={{
                    width: 100,
                  }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      defaultChecked={showAssignedToMeIdeas}
                      checked={showAssignedToMeIdeas}
                      onClick={() =>
                        setShowAssignedToMeIdeas(!showAssignedToMeIdeas)
                      }
                    />
                  }
                  label={
                    <Typography variant="body2">
                      Assigned to me ({assignedToMeCount})
                    </Typography>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      defaultChecked={showCompleted}
                      checked={showCompleted}
                      onClick={() => setShowCompleted(!showCompleted)}
                    />
                  }
                  label={<Typography variant="body2">Completed</Typography>}
                />
              </FlexVCenter>
            </FlexVCenter>
            <Flex justifyContent={"space-between"}>
              <FlexVCenter gap={2}>
                <FormControl size="small">
                  <InputLabel id="waiting-for-ideas-filter-label">
                    Ideas waiting ideas
                  </InputLabel>
                  <Select
                    size="small"
                    sx={{
                      minWidth: 180,
                      "& label": {
                        color: "red",
                      },
                    }}
                    value={waitingForIdeasFilter}
                    label="Ideas waiting ideas"
                    labelId="waiting-for-ideas-filter-label"
                    onChange={(e) =>
                      setWaitingForIdeasFilter(e.target.value as any)
                    }
                  >
                    <MenuItem value="none">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="hide ideas waiting ideas">
                      Hide ideas waiting ideas
                    </MenuItem>
                    <MenuItem value="waiting for idea">
                      Only ideas waiting ideas
                    </MenuItem>
                    <MenuItem value="being waited for">
                      Only ideas being waited for
                    </MenuItem>
                    <MenuItem value="being waited for and not waiting">
                      Only ideas being waited for and not waiting
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small">
                  <InputLabel id="requires-changes-filter-label">
                    Requires change filter
                  </InputLabel>
                  <Select
                    size="small"
                    sx={{
                      minWidth: 180,
                    }}
                    value={requiresChangeFilter}
                    label="Requires change filter"
                    labelId="requires-changes-filter-label"
                    onChange={(e) => {
                      setRequiresChangeFilter(e.target.value as any)
                    }}
                  >
                    <MenuItem value="show all">Show all</MenuItem>
                    <MenuItem value="requires change">Requires change</MenuItem>
                    <MenuItem value="already changed">Already changed</MenuItem>
                  </Select>
                </FormControl>
              </FlexVCenter>

              <MyTextField
                label="Labels"
                value={labelsFilter}
                onChange={(e) => setLabelsFilter(e.target.value)}
                sx={{
                  width: 180,
                }}
              />
            </Flex>
          </FlexCol>
        </TableFooter>
      </FlexVCenter>
    </Paper>
  )
}

export default HighlyRatedIdeasTable
