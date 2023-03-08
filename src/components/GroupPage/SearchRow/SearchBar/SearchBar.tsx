import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupIdeasQuery from "@/hooks/react-query/domain/group/idea/useGroupIdeasQuery"
import useGroupTabsQuery from "@/hooks/react-query/domain/group/tab/useGroupTabsQuery"
import useSubideasQuery from "@/hooks/react-query/domain/subidea/useSubideasQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import textContainsWords from "@/utils/text/textContainsWords"

import {
  Autocomplete,
  Box,
  FormControl,
  MenuItem,
  Popper,
  Select,
} from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { MdSearch } from "react-icons/md"
import SearchBarIdeaOption from "./SearchBarIdeaOption/SearchBarIdeaOption"
import SearchBarSubideaOption from "./SearchBarSubideaOption/SearchBarSubideaOption"

type SearchType = "ideas" | "subideas"

const SearchBar = () => {
  const { groupId } = useRouterQueryString()
  const { data: groupIdeas, refetch } = useGroupIdeasQuery(groupId!)
  const { data: subideas } = useSubideasQuery(groupId)

  const [selectedSearchType, setSelectedSearchType] =
    useState<SearchType>("ideas")

  const { data: tabs } = useGroupTabsQuery(groupId!)

  const openIdeaDialog = useIdeaDialogStore((s) => s.openDialog)
  const dialogIsOpen = useIdeaDialogStore((s) => s.dialogIsOpen)

  const [text, setText] = useState("")

  const [selectedIdea, setSelectedIdea] = useState<IdeaDto | null>(null)

  const MyPopper = useCallback(
    function (props: React.ComponentProps<typeof Popper>) {
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
    },
    [dialogIsOpen, text]
  )

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
    if (!text) return []

    const ideas = selectedSearchType === "ideas" ? groupIdeas : subideas
    if (!ideas) return []

    return ideas
      .filter(
        (i) =>
          textContainsWords(i.name, text) ||
          i.id.includes(text) ||
          textContainsWords(i.description, text)
      )
      .sort((a, b) => {
        if (a.isDone && !b.isDone) return 1
        return -1
      })
  }, [text, groupIdeas, selectedSearchType])

  const label = useMemo(() => {
    if (selectedSearchType === "ideas") return "Idea title, ID or description"
    return "Search subidea title"
  }, [selectedSearchType])

  return (
    <Box onClick={() => refetch()}>
      <FlexVCenter>
        <Autocomplete
          value={selectedIdea}
          onBlur={() => setText("")}
          onChange={(e, idea) => {
            console.log({
              idea,
            })
            if (typeof idea === "string") return
            if (idea?.parentId) {
              const parentIdea = groupIdeas?.find((i) => i.id === idea.parentId)
              console.log({
                parentIdea,
              })
              if (parentIdea) {
                setSelectedIdea(parentIdea)
              }

              return
            }
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
              label={
                <FlexVCenter gap={1}>
                  <MdSearch />
                  <span>{label}</span>
                </FlexVCenter>
              }
              size="small"
              sx={{ width: 260 }}
              InputProps={{
                ...params.InputProps,

                style: {
                  borderRadius: "4px 0px 0px 4px",
                },
              }}
            />
          )}
          getOptionLabel={(option) => {
            if (typeof option === "string") return option
            return option.name
          }}
          renderOption={(htmlAttributes, idea) =>
            selectedSearchType === "subideas" ? (
              <SearchBarSubideaOption
                key={idea.id}
                idea={idea}
                htmlAttributes={htmlAttributes}
                groupId={groupId}
              />
            ) : (
              <SearchBarIdeaOption
                key={idea.id}
                idea={idea}
                htmlAttributes={htmlAttributes}
                groupId={groupId}
              />
            )
          }
        />

        <FormControl
          variant="outlined"
          size="small"
          style={{
            borderRadius: "0px 4px 4px 0px",
            position: "relative",
          }}
        >
          <Select
            value={selectedSearchType}
            onChange={(e) => {
              console.log(e.target.value)
              setSelectedSearchType(e.target.value as SearchType)
            }}
            sx={{ borderRadius: "0px 4px 4px 0px", width: 110 }}
          >
            <MenuItem value={"ideas" as SearchType}>Ideas</MenuItem>
            <MenuItem value={"subideas" as SearchType}>Subideas</MenuItem>
          </Select>
        </FormControl>
      </FlexVCenter>
    </Box>
  )
}

export default SearchBar
