import dynamic from "next/dynamic"
import React from "react"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  TableContainer,
  TableRow,
  TableCell,
  Typography,
  TableBody,
} from "@mui/material"
import FlexVCenter from "../_common/flexboxes/FlexVCenter"
import FlexHCenter from "../_common/flexboxes/FlexHCenter"
import S from "./AssignedIdeasPage.styles"
import FlexCol from "../_common/flexboxes/FlexCol"
import Flex from "../_common/flexboxes/Flex"

const AssignedIdeasPage = () => {
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
                  <S.TableRow id="1" className="idea-table-row" hover>
                    <TableCell align="center">1</TableCell>
                    <TableCell>
                      Criar uma página onde consigo ver todas as ideias
                      "assigned to me", independente do grupo
                    </TableCell>
                    <TableCell>Ideameter</TableCell>
                    <TableCell>Funcionalidades</TableCell>
                  </S.TableRow>
                  <S.TableRow id="2" className="idea-table-row" hover>
                    <TableCell align="center">2</TableCell>
                    <TableCell>
                      Criar uma página onde consigo ver todas as ideias
                      "assigned to me", independente do grupo
                    </TableCell>
                    <TableCell>Ideameter</TableCell>
                    <TableCell>Funcionalidades</TableCell>
                  </S.TableRow>
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
