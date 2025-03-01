import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore"
import useGroupFilterStore from "@/hooks/zustand/domain/group/useGroupFilterStore"
import {
  findSortOptionByAttribute,
  ideaSortOptionsDivided,
} from "@/types/domain/idea/ideaSortOptions"
import { Divider, Menu, MenuItem, useTheme } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa"
interface Props {
  test?: string
}

const ariaLabel = `sort-button`

const IdeaSortButton = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const [filter] = useGroupFilterStore((s) => [s.filter])

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [sortingBy, setSortingBy] = useGroupFilterStore((s) => [
    s.sortingBy,
    s.setSortingBy,
  ])

  const selectedSortOption = useMemo(() => {
    return findSortOptionByAttribute(sortingBy.attribute)
  }, [sortingBy])

  const previousSortingByRef = useRef(sortingBy)

  const { tabId } = useRouterQueryString()

  useEffect(() => {
    if (filter.onlyCompletedIdeas) {
      previousSortingByRef.current = sortingBy
      setSortingBy({ attribute: "completedAt", order: "desc" }, tabId)
      return
    }

    setSortingBy(previousSortingByRef.current, tabId)
  }, [filter.onlyCompletedIdeas])

  const theme = useTheme()
  const backgroundColor = useMemo(() => {
    if (sortingBy.attribute === "avgRating") {
      return undefined
    }
    return theme.palette.secondary.main
  }, [sortingBy])

  const { authUser } = useAuthStore()

  return (
    <>
      <DarkButton
        id={ariaLabel}
        onClick={handleOpen}
        sx={{
          paddingLeft: 1.5,
          background: backgroundColor,
          ":hover": {
            background: backgroundColor,
          },
        }}
        startIcon={
          sortingBy.order === "desc" ? (
            <FaSortAmountDown size={16} />
          ) : (
            <FaSortAmountUpAlt />
          )
        }
        // disabled={isDisabled}
      >
        {selectedSortOption?.buttonLabel}
      </DarkButton>

      <Menu
        id={`${ariaLabel}-menu`}
        anchorEl={anchorEl}
        // getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {ideaSortOptionsDivided.map((sortOptions, i) => (
          <div key={sortOptions[0].menuText}>
            {i > 0 && <Divider />}

            {sortOptions.map((option) => {
              if (
                (option.attribute === "experience" ||
                  option.attribute === "rewarding") &&
                authUser?.username !== "pauloendoh"
              ) {
                return null
              }

              return (
                <MenuItem
                  key={option.attribute}
                  selected={sortingBy.attribute === option.attribute}
                  onClick={() => {
                    setSortingBy(
                      { attribute: option.attribute, order: "desc" },
                      tabId
                    )
                    handleClose()
                  }}
                >
                  {option.menuText}
                </MenuItem>
              )
            })}
          </div>
        ))}
      </Menu>
    </>
  )
}

export default IdeaSortButton
