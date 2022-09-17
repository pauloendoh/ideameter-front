import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupIdeasQuery from "@/hooks/react-query/domain/group/idea/useGroupIdeasQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import textContainsWords from "@/utils/text/textContainsWords"
import { Autocomplete, Box, Popper } from "@mui/material"
import { useEffect, useMemo, useState } from "react"

interface Props {
  test?: string
}

// PE 1/3 - rename to <GroupSearchBox /> ?
const GroupSearchBar = (props: Props) => {
  const { groupId } = useRouterQueryString()
  const { data: groupIdeas, refetch } = useGroupIdeasQuery(groupId!)

  const openIdeaDialog = useIdeaDialogStore((s) => s.openDialog)
  const dialogIsOpen = useIdeaDialogStore((s) => s.dialogIsOpen)

  const [text, setText] = useState("")

  const [selectedIdea, setSelectedIdea] = useState<IdeaDto | null>(null)

  const MyPopper = function (props: React.ComponentProps<typeof Popper>) {
    return (
      <Popper
        {...props}
        sx={{ width: 700, display: dialogIsOpen ? "none" : "unset" }}
        placement="bottom-start"
      />
    )
  }

  useEffect(() => {
    if (!selectedIdea) return
    openIdeaDialog(selectedIdea)

    setSelectedIdea(null)
  }, [selectedIdea])

  const filteredIdeas = useMemo(() => {
    if (!groupIdeas) return []
    return groupIdeas.filter((i) => textContainsWords(i.name, text))
  }, [text, groupIdeas])

  return (
    <Box onClick={() => refetch()}>
      <Autocomplete
        value={selectedIdea}
        onChange={(e, idea) => {
          setSelectedIdea(idea)
        }}
        filterOptions={(ideas) => ideas} // disable autocomplete default filter behavior
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
        getOptionLabel={(option) => option.name}
      />
    </Box>
  )
}

export default GroupSearchBar
