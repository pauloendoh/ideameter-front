import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupTabsQuery from "@/hooks/react-query/domain/group/tab/useGroupTabsQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import urls from "@/utils/urls"
import { Autocomplete, Popper } from "@mui/material"
import { useRouter } from "next/router"
import { useMemo } from "react"
import TabSelectorItem from "./TabSelectorItem/TabSelectorItem"

interface Props {
  test?: string
}

const SearchRowTabSelector = (props: Props) => {
  const router = useRouter()
  const { groupId, tabId } = useRouterQueryString()
  const { data: tabs } = useGroupTabsQuery(groupId!)

  const selectedTab = useMemo(() => {
    if (tabs && tabId) {
      return tabs.find((t) => t.id === tabId)
    }

    return undefined
  }, [tabs, tabId])

  // useEffect(() => {
  //   if (tabs && !tabId) {
  //     const firstTab = tabs[0]
  //     if (firstTab) router.push(urls.pages.groupTab(groupId!, firstTab.id))
  //   }
  // }, [tabId, tabs])

  const MyPopper = function (props: React.ComponentProps<typeof Popper>) {
    return (
      <Popper
        {...props}
        sx={{
          minWidth: 300,
        }}
        placement="bottom-start"
      />
    )
  }

  return (
    <Autocomplete
      PopperComponent={MyPopper}
      disableClearable
      value={selectedTab}
      options={tabs || []}
      getOptionLabel={(option) => option.name}
      onChange={(e, tab) => {
        if (tab) router.push(urls.pages.groupTab(groupId!, tab.id))
      }}
      renderInput={(params) => (
        <MyTextField {...params} label="Tab" size="small" sx={{ width: 168 }} />
      )}
      renderOption={(props, tab) => (
        <TabSelectorItem key={tab.id} tab={tab} htmlProps={props} />
      )}
    />
  )
}

export default SearchRowTabSelector
