import { Container } from "@mui/material"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import HighImpactVotedTable from "./HighImpactVotedTable/HighImpactVotedTable"

const HighImpactVotedPage = () => {
  return (
    <HomeLayout>
      <Container sx={{ mt: 4, alignItems: "center", justifyContent: "center" }}>
        <HighImpactVotedTable />
      </Container>
    </HomeLayout>
  )
}

export default HighImpactVotedPage
