import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import FilterButton from "./FilterButton/FilterButton";
import GroupSearchBar from "./GroupSearchBar/GroupSearchBar";

interface Props {
  test?: string;
}

const SearchRow = (props: Props) => {
  return (
    <FlexVCenter sx={{ justifyContent: "space-between", mx: 2, pb: 1 }}>
      <GroupSearchBar />
      <FilterButton />
    </FlexVCenter>
  );
};

export default SearchRow;
