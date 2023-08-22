import AssignedIdeasTableBody from "@/components/AssignedIdeasPage/AssignedIdeasTableBody/AssignedIdeasTableBody"
import AssignedIdeasTableHead, {
  Header,
} from "@/components/AssignedIdeasPage/AssignedIdeasTableHead/AssignedIdeasTableHead"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useHighImpactVotedByMeQuery from "@/hooks/react-query/domain/idea/useHighImpactVotedByMeQuery"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
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

const HighImpactVotedTable = (props: Props) => {
  const { data, isSuccess } = useHighImpactVotedByMeQuery()

  const [showCompleted, setShowCompleted] = useState(false)

  const { getUserId } = useAuthStore()

  const sortedIdeas = useMemo(() => {
    if (!data) {
      return []
    }

    let ideas = showCompleted
      ? data.filter((i) => i.idea.isDone)
      : data.filter((i) => !i.idea.isDone)

    // sort ideas by createdAt desc
    ideas = ideas.sort((a, b) => {
      const myVoteACreatedAt =
        a.idea.highImpactVotes.find((v) => v.userId === getUserId())
          ?.createdAt || ""
      const myVoteBCreatedAt =
        b.idea.highImpactVotes.find((v) => v.userId === getUserId())
          ?.createdAt || ""

      return (
        new Date(myVoteBCreatedAt).getTime() -
        new Date(myVoteACreatedAt).getTime()
      )
    })

    return ideas
  }, [data, showCompleted])

  if (!isSuccess) {
    return null
  }

  return (
    <Paper sx={{ mt: 2, background: "#2B2B2B" }}>
      <FlexVCenter flexDirection={"column"} alignItems={"start"} sx={{ pt: 1 }}>
        <Typography marginLeft={"15px"} pt="10px" pb="15px" fontWeight="bold">
          High impact voted
        </Typography>
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

export default HighImpactVotedTable
