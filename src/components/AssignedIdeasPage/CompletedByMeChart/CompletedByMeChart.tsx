import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import {
  Box,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useState } from "react"
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

const CompletedByMeChart = () => {
  const isLargeScreen = useMediaQuery("(min-width:600px)")

  const theme = useTheme()

  const [selectedType, setSelectedType] = useState<"count" | "complexity">(
    "complexity"
  )

  const completedIdeasCountLastYear =
    useCompletedIdeasCountLastYear(selectedType)

  return (
    <Box height={400} display="flex" flexDirection={"column"}>
      <FlexVCenter justifyContent={"space-between"}>
        <Typography variant="h5">Completed ideas assigned to you</Typography>
        <Select
          size="small"
          sx={{
            width: 160,
          }}
          value={selectedType}
          onChange={(e) => {
            console.log(e.target.value)
            setSelectedType(e.target.value as "count" | "complexity")
          }}
        >
          <MenuItem value={"complexity"}>Complexity</MenuItem>
          <MenuItem value={"count"}>Count</MenuItem>
        </Select>
      </FlexVCenter>
      <BarChart
        key={selectedType}
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

        <Bar
          dataKey="count"
          fill={
            selectedType === "count"
              ? theme.palette.primary.main
              : theme.palette.secondary.main
          }
        >
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
