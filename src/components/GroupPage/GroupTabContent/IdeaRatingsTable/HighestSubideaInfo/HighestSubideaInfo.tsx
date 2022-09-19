import useSubideaRatingsQueryUtils from "@/hooks/react-query/domain/rating/useSubideaRatingsQueryUtils"
import { Box } from "@mui/material"
import { useRouter } from "next/router"
import { useMemo } from "react"

interface Props {
  ideaId: string
}

const HighestSubideaInfo = (props: Props) => {
  const query = useRouter().query as { groupId: string }
  const { data } = useSubideaRatingsQueryUtils(props.ideaId, query.groupId)

  const highestSubideaRating = useMemo(() => {
    if (data.length === 0) return null

    const sorted = data.sort((a, b) =>
      Number(a.avgRating) > Number(b.avgRating) ? -1 : 1
    )
    return sorted[0]
  }, [data])

  if (data.length === 0 || highestSubideaRating?.avgRating === null) return null

  return (
    <Box sx={{ fontStyle: "italic" }} mt={1}>
      {highestSubideaRating?.idea.name}
      <span
        style={{
          background: "#535353",
          fontStyle: "normal",
          padding: "0px 4px",
          borderRadius: 4,
          marginLeft: 8,
        }}
      >
        {highestSubideaRating?.avgRating}
      </span>
    </Box>
  )
}

export default HighestSubideaInfo
