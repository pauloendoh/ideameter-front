import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery"
import useGroupLabelsQuery from "@/hooks/react-query/domain/label/useGroupLabelsQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import {
  Badge,
  Checkbox,
  Divider,
  Menu,
  Typography,
  useTheme,
} from "@mui/material"
import { useMemo, useState } from "react"
import { MdFilterAlt } from "react-icons/md"
import { useTabRateCount } from "../../GroupTabs/GroupTabItem/useTabRateCount/useTabRateCount"
import LabelsSelector from "./LabelsSelector/LabelsSelector"
import MembersMultiSelector from "./MembersMultiSelector/MembersMultiSelector"
import VotedHighImpactSelector from "./VotedHighImpactSelector/VotedHighImpactSelector"
import S from "./styles"

// PE 2/3
const FilterButton = () => {
  const [anchorEl, setAnchorEl] = useState(null)

  const routerQuery = useRouterQueryString()

  const { data: groupMembers } = useGroupMembersQuery(routerQuery.groupId)

  const { data: labels } = useGroupLabelsQuery(routerQuery.groupId!)

  const {
    filter,
    getFilterCount,
    setFilterLabelIds,
    toggleRequiresYourRating,
    setMinRatingCount,
    setMinAvgRating,
    setExcludeLabelIds: setFilterOutLabelIds,
    setVotedHighImpactBy,
    setOnlyShowRatingsByMemberIds,
  } = useGroupFilterStore()

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const sortedLabels = useMemo(() => {
    return labels?.sort((a, b) => (a.position > b.position ? 1 : -1)) || []
  }, [labels])

  const theme = useTheme()

  const tabRateCount = useTabRateCount({
    groupId: routerQuery.groupId,
    tabId: routerQuery.tabId,
  })

  return (
    <Badge color="error" variant={tabRateCount > 0 ? "dot" : "standard"}>
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
        <S.MenuItem onClick={() => toggleRequiresYourRating(routerQuery.tabId)}>
          <Checkbox checked={filter.requiresYourRating} name="current-goal" />
          <Badge
            color="error"
            variant={tabRateCount > 0 ? "dot" : "standard"}
            componentsProps={{
              badge: {
                style: {
                  top: 8,
                },
              },
            }}
          >
            <S.CheckboxLabel>Requires your rating</S.CheckboxLabel>
          </Badge>
        </S.MenuItem>

        <S.MenuItem
          sx={{ display: "flex", justifyContent: "space-between", py: "4px" }}
        >
          <Typography>Min. average rating</Typography>
          <MyTextField
            value={filter.minAvgRating}
            type="number"
            inputProps={{
              step: ".1",
              onKeyDown: (e) => {
                e.stopPropagation()
              },
            }}
            sx={{
              width: 80,
              "input[type=number]::-webkit-inner-spin-button": {
                opacity: 1,
              },
            }}
            focused={filter.minAvgRating > 0}
            onChange={(e) => {
              let text = e.target.value

              const value = Math.max(0, Number(text))
              const finalValue = value > 3 ? 3 : value

              setMinAvgRating(finalValue, routerQuery.tabId!)
            }}
          />
        </S.MenuItem>

        <S.MenuItem
          sx={{ display: "flex", justifyContent: "space-between", py: "4px" }}
        >
          <Typography>Min. rating count</Typography>
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

        <Divider />
        <FlexCol px={1} my={1} gap={1}>
          <VotedHighImpactSelector
            onChange={(value) => {
              setVotedHighImpactBy(value, routerQuery.tabId!)
            }}
            selectedUserId={filter.votedHighImpactBy}
          />
        </FlexCol>

        {sortedLabels.length > 0 && (
          <>
            <Divider />
            <FlexCol px={1} mt={1} gap={1}>
              <LabelsSelector
                selectedLabelIds={filter.labelIds}
                onChange={(labelsIds) =>
                  setFilterLabelIds(labelsIds, routerQuery.tabId)
                }
                inputLabel="Include labels"
              />

              <LabelsSelector
                selectedLabelIds={filter.excludeLabelIds}
                onChange={(labelsIds) =>
                  setFilterOutLabelIds(labelsIds, routerQuery.tabId)
                }
                inputLabel="Exclude labels"
              />
            </FlexCol>
          </>
        )}
        <Divider />
        <FlexCol px={1} mt={1} gap={1}>
          <MembersMultiSelector
            onChange={(memberIds) => {
              setOnlyShowRatingsByMemberIds(memberIds, routerQuery.tabId)
            }}
            selectedMemberIds={filter.onlyShowRatingsByMemberIds}
            inputLabel="Only show ratings by"
          />
        </FlexCol>
      </Menu>
    </Badge>
  )
}

export default FilterButton
