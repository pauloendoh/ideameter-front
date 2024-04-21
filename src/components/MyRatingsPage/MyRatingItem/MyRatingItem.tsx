import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { AssignedToMeDto } from "@/types/domain/idea/AssignedToMeDto"
import urls from "@/utils/urls"
import { useHover } from "@mantine/hooks"
import { Link } from "@mui/material"
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
      key={idea.id}
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
          width: "100%",
        }}
      >
        <Flex
          sx={{
            justifyContent: "space-between",
          }}
        >
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
            <Link
              sx={{
                color: "unset",
                ml: 1,
                textDecoration: "none",
                ":hover": {
                  textDecoration: "underline",
                },
              }}
              href={urls.pages.groupTabIdea(group.groupId, tab.tabId, idea.id)}
              target="_blank"
            >
              {idea.name}
            </Link>
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
