import {
  Container,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import Flex from "../_common/flexboxes/Flex"
import FlexVCenter from "../_common/flexboxes/FlexVCenter"
import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import { useRouter } from "next/router"
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
  const { query } = useRouter()

  const { data: ideas, isSuccess } = useAssignedToMeQuery()

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
              <TableContainer>
                <Table>
                  <AssignedIdeasTableHead headers={headers} />
                  <AssignedIdeasTableBody ideas={ideas} />
                </Table>
              </TableContainer>
            </FlexVCenter>
          </Paper>
        </Flex>
      </Container>
    </HomeLayout>
  )
}

export default AssignedIdeasPage
