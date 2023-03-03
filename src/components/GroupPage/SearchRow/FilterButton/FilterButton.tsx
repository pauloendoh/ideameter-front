import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import useGroupLabelsQuery from "@/hooks/react-query/domain/label/useGroupLabelsQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import { Checkbox, Divider, Menu, Typography, useTheme } from "@mui/material"
import { useMemo, useState } from "react"
import { MdFilterAlt } from "react-icons/md"
import S from "./styles"

interface Props {
  test?: string
}

const FilterButton = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const routerQuery = useRouterQueryString()

  const { data: groupMembers } = useGroupMembersQuery(routerQuery.groupId)

  const { data: labels } = useGroupLabelsQuery(routerQuery.groupId!)

  const {
    filter,
    getFilterCount,
    labelIdIsInFilter,
    toggleFilterLabelId,
    toggleRequiresYourRating,
    toggleOnlyHighImpactVoted,
    setMinRatingCount,
    setMinAvgRating,
  } = useGroupFilterStore()

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // const isDisabled = useMemo(() => filter.byText?.length > 0, [filter.byText]);

  const sortedLabels = useMemo(() => {
    return labels?.sort((a, b) => (a.position > b.position ? 1 : -1)) || []
  }, [labels])

  const theme = useTheme()

  return (
    <>
      <DarkButton
        id="filter-btn"
        onClick={handleClick}
        startIcon={<MdFilterAlt />}
        sx={{
          background:
            getFilterCount() > 0 ? theme.palette.secondary.main : undefined,
          ":hover": {
            background:
              getFilterCount() > 0 ? theme.palette.secondary.main : undefined,
          },
        }}
        // disabled={isDisabled}
      >
        Filter
        {getFilterCount() > 0 && (
          <FlexVCenter
            style={{
              padding: "0px 8px",
              marginLeft: 8,
              borderRadius: 4,
              background: "#2b2b2b",
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
        PaperProps={{
          sx: {
            width: 280,
          },
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <S.MenuItem
          onClick={() => toggleOnlyHighImpactVoted(routerQuery.tabId!)}
        >
          <Checkbox
            checked={filter.onlyHighImpactVoted}
            name="voted-as-high-impact"
          />
          <S.CheckboxLabel>Voted as high impact</S.CheckboxLabel>
        </S.MenuItem>
        <S.MenuItem onClick={() => toggleRequiresYourRating(routerQuery.tabId)}>
          <Checkbox checked={filter.requiresYourRating} name="current-goal" />
          <S.CheckboxLabel>Requires your rating</S.CheckboxLabel>
        </S.MenuItem>

        <S.MenuItem
          sx={{ display: "flex", justifyContent: "space-between", py: "4px" }}
        >
          <Typography>Min. average</Typography>
          <MyTextField
            value={filter.minAvgRating}
            type="number"
            inputProps={{
              step: ".1",
            }}
            sx={{
              width: 80,
              "input[type=number]::-webkit-inner-spin-button": {
                opacity: 1,
              },
            }}
            focused={filter.minAvgRating > 0}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value))
              const finalValue = value > 3 ? 3 : value

              setMinAvgRating(finalValue, routerQuery.tabId!)
            }}
          />
        </S.MenuItem>

        <S.MenuItem
          sx={{ display: "flex", justifyContent: "space-between", py: "4px" }}
        >
          <Typography>Min. count</Typography>
          <MyTextField
            value={filter.minRatingCount}
            type="number"
            sx={{
              width: 80,
              "input[type=number]::-webkit-inner-spin-button": {
                opacity: 1,
              },
            }}
            focused={filter.minRatingCount > 0}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value))
              const finalValue =
                groupMembers?.length && value > groupMembers.length
                  ? groupMembers.length
                  : value
              setMinRatingCount(finalValue, routerQuery.tabId!)
            }}
          />
        </S.MenuItem>

        {sortedLabels.length > 0 && <Divider />}

        {sortedLabels.map((label) => (
          <S.MenuItem
            key={label.id}
            onClick={() => toggleFilterLabelId(label.id, routerQuery.tabId!)}
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
  )
}

export default FilterButton
