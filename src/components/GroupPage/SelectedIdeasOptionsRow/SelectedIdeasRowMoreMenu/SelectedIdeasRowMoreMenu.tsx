import { GrMultiple } from "react-icons/gr"

import { useCurrentGroup } from "@/hooks/domain/group/useCurrentGroup"
import useGroupIdeasQuery from "@/hooks/react-query/domain/group/idea/useGroupIdeasQuery"
import useSelectedIdeasStore from "@/hooks/zustand/domain/idea/useSelectedIdeasStore"
import urls from "@/utils/urls"
import {
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { MdMoreHoriz } from "react-icons/md"
import useMultiSelectIdeas from "../../GroupTabContent/IdeaTable/useMultiSelectIdeas/useMultiSelectIdeas"

interface Props {}

export function SelectedIdeasRowMoreMenu(props: Props) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<Element | null>(null)
  const openMenu = (event: any) => {
    setMenuAnchorEl(event.currentTarget)
  }
  const closeMenu = () => {
    setMenuAnchorEl(null) // avoids error "The `anchorEl` prop provided to the component is invalid"
  }

  const selectedIdeaIds = useSelectedIdeasStore((s) => s.selectedIdeaIds)
  const { clearSelectedIds } = useMultiSelectIdeas()
  const group = useCurrentGroup()
  const { data: groupIdeas } = useGroupIdeasQuery(group?.id ?? "")

  const handleClickOpenInMultipleTabs = () => {
    if (!group?.id || !groupIdeas) {
      return
    }

    const selectedIdeas = groupIdeas.filter((idea) =>
      selectedIdeaIds.includes(idea.id)
    )

    for (const idea of selectedIdeas) {
      if (!idea.tabId) {
        continue
      }
      window.open(
        urls.pages.groupTabIdea(group.id, idea.tabId, idea.id),
        "_blank"
      )
    }

    closeMenu()
    clearSelectedIds()
  }

  return (
    <Box>
      <IconButton
        size="small"
        onClick={(e) => {
          e.preventDefault()
          openMenu(e)
        }}
      >
        <MdMoreHoriz />
      </IconButton>

      <Menu
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={(e) => {
          closeMenu()
        }}
      >
        <MenuItem
          onClick={() => {
            handleClickOpenInMultipleTabs()
          }}
        >
          <ListItemIcon sx={{ width: 16 }}>
            <GrMultiple />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Open in multiple tabs
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}
