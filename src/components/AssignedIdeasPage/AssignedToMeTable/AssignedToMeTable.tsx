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
import { useState } from "react"
import AssignedIdeasTableBody from "../AssignedIdeasTableBody/AssignedIdeasTableBody"
import AssignedIdeasTableHead from "../AssignedIdeasTableHead/AssignedIdeasTableHead"

type Props = {}

const headers = [
  {
    header: "#",
  },
  {
    header: "idea",
    width: 360,
  },
  {
    header: "Group",
    width: 200,
  },
  {
    header: "Tab",
    width: 200,
  },
]

const AssignedToMeTable = (props: Props) => {
  const { data: ideas, isSuccess } = useAssignedToMeQuery()

  const [showCompleted, setShowCompleted] = useState(false)

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
              ideas={ideas}
              showCompleted={showCompleted}
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
