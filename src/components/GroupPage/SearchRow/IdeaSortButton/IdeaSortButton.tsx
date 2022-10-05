import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import useIdeaSortStore from "@/hooks/zustand/domain/group/useIdeaSortStore"
import {
  findSortOptionByAttribute,
  ideaSortOptionsDivided,
} from "@/types/domain/idea/ideaSortOptions"
import { Divider, Menu, MenuItem } from "@mui/material"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa"
interface Props {
  test?: string
}

const ariaLabel = `sort-button`

const IdeaSortButton = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const routerQuery = useRouter().query as { groupId: string }

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [sortingBy, setSortingBy] = useIdeaSortStore((s) => [
    s.sortingBy,
    s.setSortingBy,
  ])

  const selectedSortOption = useMemo(() => {
    return findSortOptionByAttribute(sortingBy.attribute)
  }, [sortingBy])

  return (
    <>
      <DarkButton
        id={ariaLabel}
        onClick={handleOpen}
        sx={{ paddingLeft: 1.5 }}
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
        {ideaSortOptionsDivided.map((sortOptions, i, a) => (
          <div key={i}>
            {i > 0 && <Divider />}

            {sortOptions.map((option, j) => (
              <MenuItem
                key={option.attribute}
                selected={sortingBy.attribute === option.attribute}
                onClick={() => {
                  setSortingBy({ attribute: option.attribute, order: "desc" })
                  handleClose()
                }}
              >
                {option.menuText}
              </MenuItem>
            ))}
          </div>
        ))}
      </Menu>
    </>
  )
}

export default IdeaSortButton
