import MyTextField from "@/components/_common/inputs/MyTextField"
import {
  TabGroup,
  useSearchGroupTabsQuery,
} from "@/hooks/react-query/domain/group/tab/useSearchGroupTabsQuery"
import useDebounce from "@/hooks/utils/useDebounce"
import textContainsWords from "@/utils/text/textContainsWords"
import urls from "@/utils/urls"
import { Autocomplete, IconButton } from "@mui/material"
import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import { MdClose, MdSearch } from "react-icons/md"

// PE 2/3
const NavbarSearch = () => {
  const [isActive, setIsActive] = useState(false)

  const [query, setQuery] = useState("")

  const shouldShow = useMemo(
    () => isActive || query.length > 0,
    [isActive, query]
  )

  const debouncedQuery = useDebounce(query, 500)

  const { data } = useSearchGroupTabsQuery(debouncedQuery)

  const getOptionLabel = (option: TabGroup) => {
    return `[${option.group.name}] ${option.tab.name}`
  }

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      {!shouldShow && (
        <IconButton onClick={() => setIsActive(!isActive)}>
          <MdSearch />
        </IconButton>
      )}

      {shouldShow && (
        <Autocomplete
          style={{ width: 300 }}
          size="small"
          freeSolo
          options={data ?? []}
          getOptionLabel={(option) => {
            if (typeof option === "string") return option
            return getOptionLabel(option)
          }}
          inputValue={query}
          onChange={(e, option) => {
            // if (option && typeof option === "object") {
            //   setQuery(getOptionLabel(option))
            // }
          }}
          filterOptions={(options, params) => {
            const filtered = options.filter((option) => {
              const label = getOptionLabel(option)
              return textContainsWords(label, params.inputValue)
            })

            return filtered
          }}
          renderOption={(props, option) => (
            <li {...props}>
              <Link href={urls.pages.groupTab(option.group.id!, option.tab.id)}>
                <a
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                >
                  <span>
                    <span
                      style={{
                        fontWeight: textContainsWords(option.group.name, query)
                          ? "bold"
                          : "normal",
                      }}
                    >
                      [{option.group.name}]
                    </span>
                    &nbsp;
                    <span
                      style={{
                        fontWeight: textContainsWords(option.tab.name, query)
                          ? "bold"
                          : "normal",
                      }}
                    >
                      {option.tab.name}
                    </span>
                  </span>
                </a>
              </Link>
            </li>
          )}
          clearIcon={
            <MdClose
              onClick={() => {
                setQuery("")
                setIsActive(false)
              }}
            />
          }
          onBlur={() => setIsActive(false)}
          renderInput={(params) => (
            <MyTextField
              {...params}
              autoFocus
              inputRef={inputRef}
              onClick={() => {
                inputRef.current?.select()
              }}
              onBlur={() => setIsActive(false)}
              onChange={(e) => {
                setQuery(e.target.value)
                setIsActive(true)
              }}
              placeholder="Search groups and tabs"
              onClickClearIcon={() => {
                console.log("clear")
                setQuery("")
                setIsActive(false)
              }}
            />
          )}
        />
      )}
    </div>
  )
}

export default NavbarSearch
