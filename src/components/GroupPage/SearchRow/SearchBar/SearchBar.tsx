import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupIdeasQuery from "@/hooks/react-query/domain/group/idea/useGroupIdeasQuery"
import useGroupTabsQuery from "@/hooks/react-query/domain/group/tab/useGroupTabsQuery"
import useSubideasQuery from "@/hooks/react-query/domain/subidea/useSubideasQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import textContainsWords from "@/utils/text/textContainsWords"

import useDebounce from "@/hooks/utils/useDebounce"
import { Autocomplete, Box, Popper } from "@mui/material"
import { valueIsOneOf } from "endoh-utils"
import { useCallback, useEffect, useMemo, useState } from "react"
import { MdSearch } from "react-icons/md"
import SearchBarIdeaOption from "./SearchBarIdeaOption/SearchBarIdeaOption"
import SearchBarSubideaOption from "./SearchBarSubideaOption/SearchBarSubideaOption"

type SearchType = "ideas" | "subideas"

type Props = {
  label?: string
  ignoreIdeaIds?: string[]
  hidePopper?: boolean
  popperMinWidth?: number
  overrideOnSelect?: (idea: IdeaDto) => void
}

const SearchBar = (props: Props) => {
  const { groupId } = useRouterQueryString()
  const { data: groupIdeas, refetch } = useGroupIdeasQuery(groupId!)
  const { data: subideas } = useSubideasQuery(groupId)

  // PE 1/3 - delete?
  const [selectedSearchType, setSelectedSearchType] =
    useState<SearchType>("ideas")

  const { data: tabs } = useGroupTabsQuery(groupId!)

  const openIdeaDialog = useIdeaDialogStore((s) => s.openDialog)
  const dialogIsOpen = useIdeaDialogStore((s) => s.dialogIsOpen)

  const [text, setText] = useState("")
  const debouncedText = useDebounce(text, 300)

  const [selectedIdea, setSelectedIdea] = useState<IdeaDto | null>(null)

  const MyPopper = useCallback(
    function (popperProps: React.ComponentProps<typeof Popper>) {
      return (
        <Popper
          {...popperProps}
          sx={{
            minWidth: props.popperMinWidth ?? 600,
            display: props.hidePopper ? "none" : "unset",
            zIndex: 1000,
          }}
          placement="bottom-start"
        />
      )
    },
    [dialogIsOpen, text]
  )

  useEffect(() => {
    if (!selectedIdea) return

    if (props.overrideOnSelect) {
      props.overrideOnSelect(selectedIdea)
    } else {
      openIdeaDialog(selectedIdea)
    }

    setSelectedIdea(null)
  }, [selectedIdea])

  const getTab = useCallback(
    (tabId: string | null) => {
      return tabs?.find((t) => t.id === tabId)
    },
    [tabs]
  )

  const filteredIdeas = useMemo(() => {
    if (!debouncedText) return []

    const ideas = selectedSearchType === "ideas" ? groupIdeas : subideas
    if (!ideas) return []

    const result = ideas
      .filter((i) => {
        const ideaTab = getTab(i.tabId)
        const fullText = `${i.name} ${i.id} ${i.description} ${
          ideaTab?.name ?? ""
        }`.toLowerCase()

        return textContainsWords(fullText, debouncedText.toLowerCase())
      })
      .filter((i) => {
        if (props.ignoreIdeaIds) {
          return !valueIsOneOf(i.id, props.ignoreIdeaIds)
        }
        return true
      })
      .sort((a, b) => {
        // desc
        return a.highImpactVotes.length - b.highImpactVotes.length
      })
      .sort((a, b) => {
        if (a.isArchived && !b.isArchived) return 1
        if (a.isDone && !b.isDone) return 1
        return -1
      })

    return result
  }, [debouncedText, groupIdeas, selectedSearchType, props.ignoreIdeaIds])

  const label = useMemo(() => {
    if (props.label) {
      return props.label
    }
    if (selectedSearchType === "ideas") return "Idea title, ID or description"
    return "Search subidea title"
  }, [selectedSearchType, props.label])

  const noOptionsText = useMemo(() => {
    if (text.length === 0) return "Start typing to search"
    if (text.length > 0 && text.length < 3) return "Type at least 3 characters"
    return "No results found"
  }, [text])

  return (
    <Box onClick={() => refetch()}>
      <FlexVCenter>
        <Autocomplete
          value={selectedIdea}
          onBlur={() => setText("")}
          noOptionsText={noOptionsText}
          onChange={(e, idea) => {
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
                tab={getTab(idea.tabId)}
              />
            )
          }
        />

        {/* <FormControl
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
        </FormControl> */}
      </FlexVCenter>
    </Box>
  )
}

export default SearchBar
