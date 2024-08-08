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
      if (rating.idea.isDone) return highest
      if (Number(rating.avgRating) > highest) return Number(rating.avgRating)
      return highest
    }, 0)

    return ideaSubideaRatings
      .filter((r) => r.avgRating === highestRating)
      .filter((r) => !r.idea.isDone)
  }, [ideaSubideaRatings])

  const otherHighestSubideas = useMemo(() => {
    const [x, ...other] = highestSubideas
    return other
  }, [highestSubideas])

  const othersLabel = useMemo(() => {
    if (otherHighestSubideas.length === 0) return ""
    if (otherHighestSubideas.length === 1) return "+1 other"
    return `+${otherHighestSubideas.length} others`
  }, [otherHighestSubideas])

  if (ideaSubideaRatings.length === 0 || highestSubideas.length === 0)
    return null

  return (
    <FlexCol gap={1}>
      <Box sx={{ fontStyle: "italic" }}>
        {highestSubideas[0].idea.name}
        <span
          style={{
            background: "#535353",
            padding: "0px 4px",
            borderRadius: 4,
            marginLeft: 8,
            fontStyle: "italic",
          }}
        >
          Highest subidea
        </span>
      </Box>
      <i>{otherHighestSubideas.length > 0 && othersLabel}</i>
    </FlexCol>
  )
}

export default HighestSubideaInfo
