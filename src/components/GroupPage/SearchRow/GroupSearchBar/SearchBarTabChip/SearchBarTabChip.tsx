import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import TabDto from "@/types/domain/group/tab/TabDto"
import { useTheme } from "@mui/material"

interface Props {
  tab?: TabDto
}

const SearchBarTabChip = (props: Props) => {
  const theme = useTheme()

  if (!props.tab) return null

  return (
    <FlexVCenter
      sx={{
        px: 1,
        py: 0.25,
        borderRadius: 0.5,
        background: theme.palette.grey[800],
      }}
    >
      {props.tab.name}
    </FlexVCenter>
  )
}

export default SearchBarTabChip
