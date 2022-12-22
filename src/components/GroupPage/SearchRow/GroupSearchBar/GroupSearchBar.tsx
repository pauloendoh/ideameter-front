import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupIdeasQuery from "@/hooks/react-query/domain/group/idea/useGroupIdeasQuery"
import useGroupTabsQuery from "@/hooks/react-query/domain/group/tab/useGroupTabsQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import textContainsWords from "@/utils/text/textContainsWords"

import { Autocomplete, Box, Popper, useTheme } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import SearchBarItem from "./SearchBarItem/SearchBarItem"

interface Props {
  test?: string
}

// PE 1/3 - rename to <GroupIdeasSearchBox /> ?
const GroupSearchBar = (props: Props) => {
  const { groupId } = useRouterQueryString()
  const { data: groupIdeas, refetch } = useGroupIdeasQuery(groupId!)

  const { data: tabs } = useGroupTabsQuery(groupId!)

  const openIdeaDialog = useIdeaDialogStore((s) => s.openDialog)
  const dialogIsOpen = useIdeaDialogStore((s) => s.dialogIsOpen)

  const [text, setText] = useState("")

  const [selectedIdea, setSelectedIdea] = useState<IdeaDto | null>(null)

  const MyPopper = function (props: React.ComponentProps<typeof Popper>) {
    return (
      <Popper
        {...props}
        sx={{
          minWidth: 480,
          display: dialogIsOpen || text.length === 0 ? "none" : "unset",
        }}
        placement="bottom-start"
      />
    )
  }

  useEffect(() => {
    if (!selectedIdea) return
    openIdeaDialog(selectedIdea)

    setSelectedIdea(null)
  }, [selectedIdea])

  const getTab = useCallback(
    (tabId: string | null) => {
      return tabs?.find((t) => t.id === tabId)
    },
    [tabs]
  )

  const filteredIdeas = useMemo(() => {
    if (!groupIdeas) return []
    if (!text) return []

    return groupIdeas
      .filter((i) => textContainsWords(i.name, text))
      .sort((a, b) => {
        if (a.isDone && !b.isDone) return 1
        return -1
      })
  }, [text, groupIdeas])

  const theme = useTheme()

  return (
    <Box onClick={() => refetch()}>
      <Autocomplete
        value={selectedIdea}
        onBlur={() => setText("")}
        onChange={(e, idea) => {
          if (typeof idea === "string") return
          setSelectedIdea(idea)
        }}
        filterOptions={(ideas) => ideas} // disable autocomplete default filter behavior
        //https://github.com/mui/material-ui/issues/33602
        PopperComponent={MyPopper}
        options={filteredIdeas || []}
        renderInput={(params) => (
          <MyTextField
            {...params}
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Search ideas"
            size="small"
            sx={{ width: 200 }}
          />
        )}
        getOptionLabel={(option) => {
          if (typeof option === "string") return option
          return option.name
        }}
        renderOption={(htmlAttributes, idea) => (
          <SearchBarItem
            key={idea.id}
            idea={idea}
            htmlAttributes={htmlAttributes}
            groupId={groupId}
            tab={getTab(idea.tabId)}
          />
        )}
      />
    </Box>
  )
}

export default GroupSearchBar
