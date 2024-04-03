import useUpdateRatingPositionMutation from "@/hooks/react-query/domain/my-ratings/useUpdateRatingPositionMutation"
import { IconButton, Menu, MenuItem } from "@mui/material"
import React, { useMemo } from "react"
import { MdMoreHoriz } from "react-icons/md"

type Props = {
  isHovering: boolean
  ratingId: string
}

const MyRatingItemMenu = ({ ...props }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget)
    event.preventDefault()
    event.stopPropagation()
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isVisible = useMemo(() => {
    return props.isHovering || open
  }, [props.isHovering, open])

  const { mutate: submitRatingPositionUpdate } =
    useUpdateRatingPositionMutation()

  return (
    <div>
      <IconButton
        onClick={(e) => handleClick(e)}
        sx={{
          visibility: isVisible ? "visible" : "hidden",
        }}
      >
        <MdMoreHoriz />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={(e, reason) => {
          handleClose()
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            submitRatingPositionUpdate({
              ratingId: props.ratingId,
              position: "first",
            })
            handleClose()
          }}
        >
          Move to first
        </MenuItem>
        <MenuItem
          onClick={() => {
            submitRatingPositionUpdate({
              ratingId: props.ratingId,
              position: "last",
            })
            handleClose()
          }}
        >
          Move to last
        </MenuItem>
      </Menu>
    </div>
  )
}

export default MyRatingItemMenu
