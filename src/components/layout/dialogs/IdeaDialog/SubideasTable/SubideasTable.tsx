import IdeaRatingsTable from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/IdeaRatingsTable"
import { IdeaRating } from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils"
import { LinearProgress } from "@mui/material"

interface Props {
  isLoading: boolean
  subideaRatings: IdeaRating[]
}

const SubideasTable = (props: Props) => {
  return (
    <div>
      {props.isLoading ? (
        <LinearProgress />
      ) : (
        <IdeaRatingsTable ideaRatings={props.subideaRatings} />
      )}
    </div>
  )
}

export default SubideasTable
