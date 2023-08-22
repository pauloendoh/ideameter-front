import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import {
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableContainer,
  TableFooter,
  Typography,
} from "@mui/material"
import { useMemo, useState } from "react"
import AssignedIdeasTableBody from "../AssignedIdeasTableBody/AssignedIdeasTableBody"
import AssignedIdeasTableHead, {
  Header,
} from "../AssignedIdeasTableHead/AssignedIdeasTableHead"

type Props = {}

const headers: Header[] = [
  {
    header: "#",
    width: 64,
    align: "center",
  },
  {
    header: "idea",
    width: 360,
    align: "left",
  },
  {
    header: "Group",
    width: 200,
    align: "left",
  },
  {
    header: "Tab",
    width: 200,
    align: "left",
  },
]

const AssignedToMeTable = (props: Props) => {
  const { data, isSuccess } = useAssignedToMeQuery()

  const [showCompleted, setShowCompleted] = useState(false)

  const sortedIdeas = useMemo(() => {
    if (!data) {
      return []
    }

    let ideas = showCompleted
      ? data.filter((i) => i.idea.isDone)
      : data.filter((i) => !i.idea.isDone)

    if (showCompleted) {
      return ideas.sort((a, b) => {
        // completed at desc
        const completedAtA = a.idea.completedAt
        const completedAtB = b.idea.completedAt

        if (completedAtA === null && completedAtB === null) {
          return 0
        }

        if (completedAtA === null) {
          return 1
        }

        if (completedAtB === null) {
          return -1
        }

        return completedAtA.localeCompare(completedAtB) === 1 ? -1 : 1
      })
    }

    return ideas.sort((a, b) => {
      // sort by group name asc
      if (a.group.name > b.group.name) return 1

      return -1
    })
  }, [data, showCompleted])

  if (!isSuccess) {
    return null
  }

  return (
    <Paper sx={{ mt: 2, background: "#2B2B2B" }}>
      <FlexVCenter flexDirection={"column"} alignItems={"start"} sx={{ pt: 1 }}>
        <Typography marginLeft={"15px"} pt="10px" pb="15px" fontWeight="bold">
          Ideas assigned to me
        </Typography>
        <TableContainer sx={{ maxHeight: "calc(100vh - 400px)" }}>
          <Table stickyHeader>
            <AssignedIdeasTableHead headers={headers} />
            <AssignedIdeasTableBody
              ideas={sortedIdeas}
              showCompleted={showCompleted}
              showVotedAt={false}
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
        </TableFooter>
      </FlexVCenter>
    </Paper>
  )
}

export default AssignedToMeTable
