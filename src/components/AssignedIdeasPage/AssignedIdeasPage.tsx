import {
  Container,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import Flex from "../_common/flexboxes/Flex"
import FlexVCenter from "../_common/flexboxes/FlexVCenter"
import S from "./AssignedIdeasPage.styles"
import useAssignedToMeQuery from "@/hooks/react-query/domain/idea/useAssignedToMeQuery"
import { useRouter } from "next/router"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"

type IdeaRow = {
  idea: {
    id: string
    name: string
  }
  group: {
    id: string
    name: string
  }
  tab: {
    id: string
    name: string
  }
}

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
                <S.TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell width="360px">Idea</TableCell>
                    <TableCell width="200px">Group</TableCell>
                    <TableCell width="200px">Tab</TableCell>
                  </TableRow>
                </S.TableHead>
                <TableBody>
                  {ideas?.map((ideas: IdeaRow, index: string) => (
                    <S.TableRow
                      id={ideas.idea.id}
                      className="idea-table-row"
                      hover
                    >
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell>{ideas.idea.name}</TableCell>
                      <TableCell>{ideas.group.name}</TableCell>
                      <TableCell>{ideas.tab.name}</TableCell>
                    </S.TableRow>
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
