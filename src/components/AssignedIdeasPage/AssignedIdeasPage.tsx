import {
  Container,
  Paper,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import Flex from "../_common/flexboxes/Flex"
import FlexVCenter from "../_common/flexboxes/FlexVCenter"
import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import { useRouter } from "next/router"
import AssignedIdeasRow from "./AssignedIdeasRow/AssignedIdeasRow"
import AssignedIdeasTableHead from "./AssignedIdeasTableHead/AssignedIdeasTableHead"

const headers = [
  {
    header: "#",
  },
  {
    header: "idea",
    width: "360px",
  },
  {
    header: "Group",
    width: "200px",
  },
  {
    header: "Tab",
    width: "200px",
  },
]

const AssignedIdeasPage = () => {
  const { query } = useRouter()
  const { data: ideas } = useAssignedToMeQuery(query.userId as string)

  return (
    <HomeLayout>
      <Container>
        <Flex sx={{ mt: 10 }} alignItems="center" justifyContent="center">
          <Paper sx={{ mt: 2, background: "#2B2B2B" }}>
            <FlexVCenter
              flexDirection={"column"}
              alignItems={"start"}
              sx={{ pt: 1 }}
            >
              <Typography
                marginLeft={"10px"}
                pt="10px"
                pb="15px"
                fontWeight="bold"
              >
                Ideas assigned to me
              </Typography>
              <TableContainer>
                <AssignedIdeasTableHead headers={headers} />
                <TableBody>
                  {ideas?.map((idea, index) => (
                    <AssignedIdeasRow
                      key={idea.idea.id}
                      index={index}
                      {...idea}
                    />
                  ))}
                </TableBody>
              </TableContainer>
            </FlexVCenter>
          </Paper>
        </Flex>
      </Container>
    </HomeLayout>
  )
}

export default AssignedIdeasPage
