import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import FilterButton from "./FilterButton/FilterButton"
import FilterByUsersButton from "./FilterByUsersButton/FilterByUsersButton"
import GroupSearchBar from "./GroupSearchBar/GroupSearchBar"
import IdeaSortButton from "./IdeaSortButton/IdeaSortButton"

const SearchRow = () => {
  return (
    <FlexVCenter sx={{ justifyContent: "space-between", mx: 2, pb: 1 }}>
      <GroupSearchBar />
      <FlexVCenter gap={2}>
        <IdeaSortButton />
        <FilterByUsersButton />
        <FilterButton />
      </FlexVCenter>
    </FlexVCenter>
  )
}

export default SearchRow
