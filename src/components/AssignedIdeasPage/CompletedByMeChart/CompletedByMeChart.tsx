import { Box, useMediaQuery } from "@mui/material"
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

  return (
    <Box height={400}>
      <BarChart
        height={300}
        data={completedIdeasCountLastYear}
        width={isLargeScreen ? 800 : 480}
        margin={{
          top: 16,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LLLyy" angle={-45} textAnchor="end" fontSize={12} />
        <YAxis />
        <Tooltip />

        <Bar dataKey="count" fill="#8884d8">
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
