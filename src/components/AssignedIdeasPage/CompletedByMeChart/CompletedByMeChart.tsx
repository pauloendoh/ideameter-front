import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { localStorageKeys } from "@/utils/localStorageKeys"
import { useLocalStorage } from "@mantine/hooks"
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useCompletedIdeasCountByDay } from "./useCompletedIdeasCountByDay/useCompletedIdeasCountByDay"
import { useCompletedIdeasCountByWeek } from "./useCompletedIdeasCountByWeek/useCompletedIdeasCountByWeek"
import { useCompletedIdeasCountLastYear } from "./useCompletedIdeasCountLastYear/useCompletedIdeasCountLastYear"

const CompletedByMeChart = () => {
  const isLargeScreen = useMediaQuery("(min-width:600px)")

  const theme = useTheme()

  const [selectedType, setSelectedType] = useState<"count" | "complexity">(
    "count"
  )
  const [range, setRange] = useLocalStorage<"month" | "week" | "day">({
    key: localStorageKeys.highlyRatedPage.completedIdeasRange,
    defaultValue: "month",
  })

  const completedIdeasCountLastYear =
    useCompletedIdeasCountLastYear(selectedType)

  const completedIdeasByWeek = useCompletedIdeasCountByWeek(selectedType)
  const completedIdeasCountByDay = useCompletedIdeasCountByDay(selectedType)

  const finalData = useMemo(() => {
    if (range === "day") {
      return completedIdeasCountByDay
    }
    if (range === "week") {
      return completedIdeasByWeek
    }
    return completedIdeasCountLastYear
  }, [range, completedIdeasByWeek, completedIdeasCountLastYear])

  return (
    <FlexCol height={400} alignItems={"center"}>
      <FlexCol alignItems={"center"} gap={2}>
        <Typography variant="h5">Completed ideas assigned to you</Typography>
        <FlexVCenter gap={1}>
          <FormControl>
            <InputLabel id="type-select">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Type"
              size="small"
              sx={{
                width: 140,
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
          </FormControl>

          <FormControl>
            <InputLabel id="demo-simple-select-label">Range</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              size="small"
              sx={{
                width: 100,
              }}
              value={range}
              onChange={(e) => {
                console.log(e.target.value)
                setRange(e.target.value as "month" | "week")
              }}
              label="Range"
            >
              <MenuItem value={"month"}>Month</MenuItem>
              <MenuItem value={"week"}>Week</MenuItem>
              <MenuItem value={"day"}>Day</MenuItem>
            </Select>
          </FormControl>
        </FlexVCenter>
      </FlexCol>

      <BarChart
        key={selectedType}
        height={300}
        data={finalData}
        width={isLargeScreen ? 780 : 480}
        margin={{
          top: 32,
          right: 30,
          left: 20,
          bottom: 24,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="key" angle={-45} textAnchor="end" fontSize={12} />
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
