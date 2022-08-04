import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import { Box } from "@mui/material";
import FilterButton from "./FilterButton/FilterButton";

interface Props {
  test?: string;
}

const SearchRow = (props: Props) => {
  return (
    <FlexVCenter sx={{ justifyContent: "space-between", mx: 2, pb: 1 }}>
      <Box> </Box>
      <FilterButton />
    </FlexVCenter>
  );
};

export default SearchRow;
