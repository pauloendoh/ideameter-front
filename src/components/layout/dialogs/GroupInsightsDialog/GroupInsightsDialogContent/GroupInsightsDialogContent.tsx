import GroupDto from "@/types/domain/group/GroupDto"
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import InterestSimilarityTab from "./InterestSimilarityTab/InterestSimilarityTab"
import LastCommentsTab from "./LastCommentsTab/LastCommentsTab"
import MissingRatingsTab from "./MissingRatingsTab/MissingRatingsTab"

interface Props {
  group: GroupDto
}

const GroupInsightsDialogContent = (props: Props) => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Missing Ratings" {...a11yProps(0)} />
          <Tab label="Last comments" {...a11yProps(1)} />
          <Tab label="Interest similarity" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <MissingRatingsTab groupId={props.group.id!} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <LastCommentsTab groupId={props.group.id!} />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <InterestSimilarityTab groupId={props.group.id!} />
      </TabPanel>
    </Box>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export default GroupInsightsDialogContent
