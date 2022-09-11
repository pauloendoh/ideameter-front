import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import useGroupLabelsQuery from "@/hooks/react-query/domain/label/useGroupLabelsQuery";
import useGroupFilterStore from "@/hooks/zustand/domain/auth/group/useGroupFilterStore";
import { Checkbox, Divider, Menu } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { MdFilterAlt } from "react-icons/md";
import S from "./styles";

interface Props {
  test?: string;
}

const FilterButton = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const routerQuery = useRouter().query as { groupId: string };

  const { data: labels } = useGroupLabelsQuery(routerQuery.groupId);

  const {
    filter,
    getFilterCount,
    labelIdIsInFilter,
    toggleFilterLabelId,
    toggleHidingDone,
    toggleOnlyHighImpactVoted,
  } = useGroupFilterStore();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const isDisabled = useMemo(() => filter.byText?.length > 0, [filter.byText]);

  // PE 1/3 - Check if it's being used in other places
  const sortedLabelsById = useMemo(() => {
    if (labels === undefined || labels?.length === 0) return [];
    return labels.sort((a, b) => (a.id > b.id ? 1 : -1));
  }, [labels]);

  return (
    <>
      <DarkButton
        id="filter-btn"
        onClick={handleClick}
        startIcon={<MdFilterAlt />}
        // disabled={isDisabled}
      >
        Filter
        {getFilterCount() > 0 && (
          <FlexVCenter
            style={{
              padding: "2px 8px",
              marginLeft: 8,
              borderRadius: 4,
              background: "#2b2b2b",
              minHeight: 25,
            }}
          >
            {getFilterCount()}
            {/* {isDisabled ? <MdClose /> : getFilterCount()} */}
          </FlexVCenter>
        )}
      </DarkButton>

      <Menu
        id="skillbase-filter-menu"
        anchorEl={anchorEl}
        // getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <S.MenuItem onClick={toggleHidingDone}>
          <Checkbox checked={filter.hidingDone} name="hiding-done" />
          <S.CheckboxLabel>Hide done</S.CheckboxLabel>
        </S.MenuItem>
        <S.MenuItem onClick={toggleOnlyHighImpactVoted}>
          <Checkbox
            checked={filter.onlyHighImpactVoted}
            name="voted-as-high-impact"
          />
          <S.CheckboxLabel>Voted as high impact</S.CheckboxLabel>
        </S.MenuItem>
        {/*
        <S.MenuItem onClick={toggleFilterCurrentGoal}>
          <Checkbox checked={filter.currentGoal} name="current-goal" />
          <S.CheckboxLabel>With current goal</S.CheckboxLabel>
        </S.MenuItem> */}

        {sortedLabelsById.length > 0 && <Divider />}

        {sortedLabelsById.map((label) => (
          <S.MenuItem
            key={label.id}
            onClick={() => toggleFilterLabelId(label.id)}
          >
            <Checkbox checked={labelIdIsInFilter(label.id)} name={label.name} />

            <S.CheckboxLabel
              style={{
                background: label.bgColor,
                borderRadius: 4,
              }}
            >
              {label.name}
            </S.CheckboxLabel>
          </S.MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default FilterButton;
