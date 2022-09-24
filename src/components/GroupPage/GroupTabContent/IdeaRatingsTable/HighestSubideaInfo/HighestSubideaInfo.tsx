import FlexCol from "@/components/_common/flexboxes/FlexCol"
import useSubideaRatingsQueryUtils from "@/hooks/react-query/domain/rating/useSubideaRatingsQueryUtils"
import { Box } from "@mui/material"
import { useRouter } from "next/router"
import { useMemo } from "react"

interface Props {
  ideaId: string
}

const HighestSubideaInfo = (props: Props) => {
  const query = useRouter().query as { groupId: string }
  const { data: ideaSubideaRatings } = useSubideaRatingsQueryUtils(
    props.ideaId,
    query.groupId
  )

  const highestSubideas = useMemo(() => {
    if (ideaSubideaRatings.length === 0) return []

    const highestRating = ideaSubideaRatings.reduce((highest, rating) => {
      if (Number(rating.avgRating) > highest) return Number(rating.avgRating)
      return highest
    }, 0)

    return ideaSubideaRatings.filter((r) => r.avgRating === highestRating)
  }, [ideaSubideaRatings])

  if (ideaSubideaRatings.length === 0 || highestSubideas.length === 0)
    return null

  return (
    <FlexCol gap={1}>
      {highestSubideas.map((subidea) => (
        <Box key={subidea.idea.id} sx={{ fontStyle: "italic" }}>
          {subidea.idea.name}
          <span
            style={{
              background: "#535353",
              fontStyle: "normal",
              padding: "0px 4px",
              borderRadius: 4,
              marginLeft: 8,
            }}
          >
            {subidea.avgRating}
          </span>
        </Box>
      ))}
    </FlexCol>
  )
}

export default HighestSubideaInfo
