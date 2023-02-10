import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useCompletedIdeasCountLastYear } from "./useCompletedIdeasCountLastYear/useCompletedIdeasCountLastYear"

type Props = {}

const CompletedByMeChart = (props: Props) => {
  const completedIdeasCountLastYear = useCompletedIdeasCountLastYear()

  const isLargeScreen = useMediaQuery("(min-width:600px)")

  const theme = useTheme()

  return (
    <Box
      height={400}
      display="flex"
      flexDirection={"column"}
      alignItems="center"
    >
      <Typography variant="h5">Completed ideas assigned to you</Typography>
      <BarChart
        height={300}
        data={completedIdeasCountLastYear}
        width={isLargeScreen ? 780 : 480}
        margin={{
          top: 32,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LLLyy" angle={-45} textAnchor="end" fontSize={12} />
        <YAxis />
        <Tooltip />

        <Bar dataKey="count" fill={theme.palette.secondary.main}>
          <LabelList
            dataKey="count"
            position="inside"
            fill="white"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </Box>
  )
}

export default CompletedByMeChart
