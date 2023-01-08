import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import AssignedToButton from "./AssignedToButton/AssignedToButton"
import FilterButton from "./FilterButton/FilterButton"
import IdeaSortButton from "./IdeaSortButton/IdeaSortButton"
import SearchBar from "./SearchBar/SearchBar"

const SearchRow = () => {
  return (
    <FlexVCenter sx={{ justifyContent: "space-between", mx: 2, pb: 1 }}>
      <SearchBar />
      <FlexVCenter gap={2}>
        <IdeaSortButton />
        <AssignedToButton />
        <FilterButton />
      </FlexVCenter>
    </FlexVCenter>
  )
}

export default SearchRow
