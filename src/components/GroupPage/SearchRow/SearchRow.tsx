import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import AssignedUsersButton from "./AssignedUsersButton/AssignedUsersButton"
import FilterButton from "./FilterButton/FilterButton"
import IdeaSortButton from "./IdeaSortButton/IdeaSortButton"
import SearchBar from "./SearchBar/SearchBar"

const SearchRow = () => {
  const dialogIsOpen = useIdeaDialogStore((s) => s.dialogIsOpen)

  return (
    <FlexVCenter sx={{ justifyContent: "space-between", mx: 2, pb: 1 }}>
      <SearchBar hidePopper={dialogIsOpen} />
      <FlexVCenter gap={2}>
        <IdeaSortButton />
        <AssignedUsersButton />
        <FilterButton />
      </FlexVCenter>
    </FlexVCenter>
  )
}

export default SearchRow
