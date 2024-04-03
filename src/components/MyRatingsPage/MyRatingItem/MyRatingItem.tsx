import FlexCol from "@/components/_common/flexboxes/FlexCol"
import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import { Flex } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { Typography } from "@mui/material"
import MyRatingItemMenu from "./MyRatingItemMenu/MyRatingItemMenu"

type Props = {
  assign: AssignedToMeDto
  index: number
}

const MyRatingItem = ({ assign, index, ...props }: Props) => {
  const { hovered, ref: hoverRef } = useHover()

  return (
    <FlexCol
      ref={hoverRef}
      key={assign.idea.id}
      sx={{
        borderTop: index === 0 ? "none" : "1px solid",
        py: 1,
        opacity: assign.myRating.position === null ? 0.5 : 1,
      }}
    >
      <Flex justify={"space-between"}>
        <Typography>{assign.idea.name}</Typography>
        <MyRatingItemMenu isHovering={hovered} ratingId={assign.myRating.id} />
      </Flex>
      <Typography>Is done: {String(assign.idea.isDone)}</Typography>
      <Typography>Is archived: {String(assign.idea.isArchived)}</Typography>
    </FlexCol>
  )
}

export default MyRatingItem
