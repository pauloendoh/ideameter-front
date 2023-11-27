import { Container } from "@mui/material"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import HighlyRatedIdeasTable from "./HighlyRatedIdeasTable/HighlyRatedIdeasTable"

const HighlyRatedIdeasPage = () => {
  return (
    <HomeLayout>
      <Container sx={{ mt: 4, alignItems: "center", justifyContent: "center" }}>
        <HighlyRatedIdeasTable />
      </Container>
    </HomeLayout>
  )
}

export default HighlyRatedIdeasPage
