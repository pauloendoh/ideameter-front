import IdeaTable from "@/components/GroupPage/GroupTabContent/IdeaTable/IdeaTable"
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
        <IdeaTable ideaRatings={props.subideaRatings} isSubideasTable />
      )}
    </div>
  )
}

export default SubideasTable
