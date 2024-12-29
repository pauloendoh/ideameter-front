import { Container } from "@mui/material"
import { CompletedByMeChart } from "../AssignedIdeasPage/CompletedByMeChart/CompletedByMeChart"
import FlexCol from "../_common/flexboxes/FlexCol"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import HighImpactVotedTable from "./HighImpactVotedTable/HighImpactVotedTable"

const HighImpactVotedPage = () => {
  return (
    <HomeLayout>
      <Container sx={{ mt: 4, alignItems: "center", justifyContent: "center" }}>
        <HighImpactVotedTable />
        <FlexCol mt={6}>
          <CompletedByMeChart />
        </FlexCol>
      </Container>
    </HomeLayout>
  )
}

export default HighImpactVotedPage
