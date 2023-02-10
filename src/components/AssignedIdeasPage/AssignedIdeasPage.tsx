import { Container } from "@mui/material"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import FlexCenter from "../_common/flexboxes/FlexCenter"
import AssignedToMeTable from "./AssignedToMeTable/AssignedToMeTable"
import CompletedByMeChart from "./CompletedByMeChart/CompletedByMeChart"

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
  return (
    <HomeLayout>
      <Container sx={{ mt: 4, alignItems: "center", justifyContent: "center" }}>
        <AssignedToMeTable />

        <FlexCenter mt={6}>
          <CompletedByMeChart />
        </FlexCenter>
      </Container>
    </HomeLayout>
  )
}

export default AssignedIdeasPage
