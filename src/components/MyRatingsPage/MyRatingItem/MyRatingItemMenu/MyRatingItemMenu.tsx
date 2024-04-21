import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useUpdateRatingPositionMutation from "@/hooks/react-query/domain/my-ratings/useUpdateRatingPositionMutation"
import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import { Divider, IconButton, Menu, MenuItem } from "@mui/material"
import React, { useMemo } from "react"
import {
  MdArrowDownward,
  MdArrowUpward,
  MdDelete,
  MdMoreHoriz,
} from "react-icons/md"

type Props = {
  isHovering: boolean
  ratingId: string
  assign: AssignedToMeDto
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
        size="small"
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
          <FlexVCenter gap={1}>
            <MdArrowUpward />
            <span>Move to first</span>
          </FlexVCenter>
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
          <FlexVCenter gap={1}>
            <MdArrowDownward />
            <span>Move to last</span>
          </FlexVCenter>
        </MenuItem>

        {props.assign.myRating.position !== null && (
          <>
            <Divider />
            <MenuItem
              onClick={() => {
                submitRatingPositionUpdate({
                  ratingId: props.ratingId,
                  position: null,
                })
                handleClose()
              }}
            >
              <FlexVCenter gap={1}>
                <MdDelete />
                <span>Remove position</span>
              </FlexVCenter>
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  )
}

export default MyRatingItemMenu
