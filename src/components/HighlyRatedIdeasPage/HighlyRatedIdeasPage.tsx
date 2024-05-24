import { Container } from "@mui/material"
import CompletedByMeChart from "../AssignedIdeasPage/CompletedByMeChart/CompletedByMeChart"
import FlexCol from "../_common/flexboxes/FlexCol"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import HighlyRatedIdeasTable from "./HighlyRatedIdeasTable/HighlyRatedIdeasTable"

const HighlyRatedIdeasPage = () => {
  return (
    <HomeLayout>
      <Container sx={{ mt: 4, alignItems: "center", justifyContent: "center" }}>
        <HighlyRatedIdeasTable />

        <FlexCol mt={6}>
          <CompletedByMeChart />
        </FlexCol>
      </Container>
    </HomeLayout>
  )
}

export default HighlyRatedIdeasPage
