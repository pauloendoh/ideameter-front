import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import { Flex } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import MyRatingItemMenu from "./MyRatingItemMenu/MyRatingItemMenu"

type Props = {
  assign: AssignedToMeDto
  index: number
}

const MyRatingItem = ({ assign, index, ...props }: Props) => {
  const idea = assign.idea
  const group = assign.group
  const tab = assign.tab
  const myRating = assign.myRating

  const { hovered, ref: hoverRef } = useHover()

  return (
    <Flex
      ref={hoverRef}
      sx={{
        borderTop: index === 0 ? "none" : "1px solid",
        py: 1,
        opacity: assign.myRating.position === null ? 0.5 : 1,
      }}
    >
      {myRating.position !== null && (
        <FlexVCenter
          sx={{
            justifyContent: "center",
            width: 40,
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          {myRating.position + 1}
        </FlexVCenter>
      )}
      <FlexCol
        sx={{
          py: 1,
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
          <MyRatingItemMenu
            isHovering={hovered}
            ratingId={assign.myRating.id}
            assign={assign}
          />
        </Flex>
      </FlexCol>
    </Flex>
  )
}

export default MyRatingItem
