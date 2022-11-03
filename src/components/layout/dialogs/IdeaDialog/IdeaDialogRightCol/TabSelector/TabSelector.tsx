import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupTabsQuery from "@/hooks/react-query/domain/group/tab/useGroupTabsQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import { Autocomplete } from "@mui/material"
import { useMemo } from "react"

interface Props {
  valueTabId: string | null
  onChange: (tabId: string) => void
}

const TabSelector = (props: Props) => {
  const { groupId } = useRouterQueryString()
  const { data: tabs } = useGroupTabsQuery(groupId!)

  const sortedTabs = useMemo(() => {
    if (!tabs) return []
    const sorted = tabs.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    return sorted
  }, [tabs])

  const localSelectedLabel = useMemo(() => {
    return sortedTabs.find((t) => t.id === props.valueTabId)
  }, [sortedTabs, props.valueTabId])

  return (
    <Autocomplete
      id="tags-standard"
      options={sortedTabs}
      value={localSelectedLabel}
      onChange={(e, tab) => {
        if (!tab) return

        props.onChange(tab.id)
      }}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <MyTextField {...params} label="Tab" size="small" />}
      // renderOption={(label) => (
      //   <LabelsSelectorV2Option
      //     label={label}
      //     onClickEdit={() => {
      //       props.setLabelDialogOpen(true)
      //       props.setLabelDialogInitialValue(label)
      //     }}
      //   />
      // )}
    />
  )
}

export default TabSelector
