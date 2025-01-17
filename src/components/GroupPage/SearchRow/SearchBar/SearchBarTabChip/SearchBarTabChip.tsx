import MyNextLink from "@/components/_common/MyNextLink/MyNextLink"
import TabDto from "@/types/domain/group/tab/TabDto"
import urls from "@/utils/urls"
import { Typography, useTheme } from "@mui/material"

interface Props {
  tab?: TabDto
}

const SearchBarTabChip = (props: Props) => {
  const theme = useTheme()

  if (!props.tab) return null

  return (
    <MyNextLink href={urls.pages.groupTab(props.tab.groupId, props.tab.id)}>
      <a
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Typography
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: 0.5,
            background: theme.palette.grey[800],
            justifyContent: "center",
            width: "100px",
            height: "fit-content",
          }}
          noWrap
        >
          {props.tab.name}
        </Typography>
      </a>
    </MyNextLink>
  )
}

export default SearchBarTabChip
