import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import {
  Container,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableContainer,
  TableFooter,
  Typography,
} from "@mui/material"
import { useState } from "react"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import Flex from "../_common/flexboxes/Flex"
import FlexVCenter from "../_common/flexboxes/FlexVCenter"
import AssignedIdeasTableBody from "./AssignedIdeasTableBody/AssignedIdeasTableBody"
import AssignedIdeasTableHead from "./AssignedIdeasTableHead/AssignedIdeasTableHead"

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

const AssignedIdeasPage = () => {
  const { data: ideas, isSuccess } = useAssignedToMeQuery()

  const [showCompleted, setShowCompleted] = useState(false)

  if (!isSuccess) {
    return null
  }

  return (
    <HomeLayout>
      <Container>
        <Flex sx={{ mt: 10 }} alignItems="center" justifyContent="center">
          <Paper sx={{ mt: 2, background: "#2B2B2B" }}>
            <FlexVCenter flexDirection={"column"} alignItems={"start"} sx={{ pt: 1 }}>
              <Typography marginLeft={"15px"} pt="10px" pb="15px" fontWeight="bold">
                Ideas assigned to me
              </Typography>
              <TableContainer sx={{ maxHeight: "calc(100vh - 376px)" }}>
                <Table stickyHeader>
                  <AssignedIdeasTableHead headers={headers} />
                  <AssignedIdeasTableBody ideas={ideas} showCompleted={showCompleted} />
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
        </Flex>
      </Container>
    </HomeLayout>
  )
}

export default AssignedIdeasPage
