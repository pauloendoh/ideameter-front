import FlexCol from "@/components/_common/flexboxes/FlexCol"
import {
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
    "count"
  )

  const completedIdeasCountLastYear =
    useCompletedIdeasCountLastYear(selectedType)

  return (
    <FlexCol height={400} alignItems={"center"}>
      <FlexCol alignItems={"center"} gap={1}>
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
      </FlexCol>

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
    </FlexCol>
  )
}

export default CompletedByMeChart
