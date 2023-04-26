import useHighlightableIdeasQuery from "@/hooks/react-query/domain/idea-highlight/useHighlightableIdeasQuery"
import useIdeaHighlightsQuery from "@/hooks/react-query/domain/idea-highlight/useIdeaHighlightsQuery"
import {
  Container,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useMemo, useState } from "react"
import FlexVCenter from "../_common/flexboxes/FlexVCenter"
import HomeLayout from "../layout/HomeLayout/HomeLayout"
import HighlightableIdeaRow from "./HighlightableIdeaRow/HighlightableIdeaRow"

type Props = {}

const HighlightableIdeasPage = (props: Props) => {
  const { data: ideas } = useHighlightableIdeasQuery()
  const [showHighlighted, setShowHighlighted] = useState(false)

  const { data: ideaHighlights } = useIdeaHighlightsQuery()

  const filteredIdeas = useMemo(() => {
    if (!showHighlighted) return ideas

    return ideas?.filter((idea) =>
      ideaHighlights?.some((ideaHighlight) => ideaHighlight.ideaId === idea.id)
    )
  }, [ideas, showHighlighted, ideaHighlights])

  return (
    <HomeLayout>
      <Container>
        <Paper sx={{ mt: 2, background: "#2B2B2B" }}>
          <FlexVCenter
            flexDirection={"column"}
            alignItems={"start"}
            sx={{ pt: 1 }}
          >
            <Typography
              marginLeft={"15px"}
              pt="10px"
              pb="15px"
              fontWeight="bold"
            >
              Ideas assigned to me
            </Typography>
            <TableContainer
              sx={
                {
                  // maxHeight: "calc(100vh - 400px)"
                }
              }
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell width={40} align="center">
                      #
                    </TableCell>
                    <TableCell width={100} align="center">
                      Highlighted
                    </TableCell>
                    <TableCell width={100} align="center">
                      Assigned
                    </TableCell>
                    <TableCell>Idea</TableCell>
                    <TableCell width={160}>Tab</TableCell>
                    <TableCell width={160}>Group</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIdeas?.map((idea, index) => (
                    <HighlightableIdeaRow
                      key={idea.id}
                      idea={idea}
                      index={index}
                    />
                  ))}
                </TableBody>
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
                    defaultChecked={showHighlighted}
                    checked={showHighlighted}
                    onClick={() => setShowHighlighted(!showHighlighted)}
                  />
                }
                label={`Highlighted only`}
              />
            </TableFooter>
          </FlexVCenter>
        </Paper>
      </Container>
    </HomeLayout>
  )
}

export default HighlightableIdeasPage
