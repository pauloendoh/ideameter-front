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
  const idea = assign.idea
  const group = assign.group
  const tab = assign.tab

  const { hovered, ref: hoverRef } = useHover()

  return (
    <FlexCol
      ref={hoverRef}
      key={idea.id}
      sx={{
        borderTop: index === 0 ? "none" : "1px solid",
        py: 1,
        opacity: assign.myRating.position === null ? 0.5 : 1,
      }}
    >
      <Flex justify={"space-between"}>
        <span>
          <span
            style={{
              background: "gray",
              padding: "2px 4px",
              borderRadius: 4,
            }}
          >
            {group.name} - {tab.name}
          </span>
          <span
            style={{
              marginLeft: 8,
            }}
          >
            {idea.name}
          </span>
        </span>
        <MyRatingItemMenu isHovering={hovered} ratingId={assign.myRating.id} />
      </Flex>
      <Typography>Is done: {String(idea.isDone)}</Typography>
      <Typography>Is archived: {String(idea.isArchived)}</Typography>
    </FlexCol>
  )
}

export default MyRatingItem
