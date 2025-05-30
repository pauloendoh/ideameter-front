import IdeaTable from "@/components/GroupPage/GroupTabContent/IdeaTable/IdeaTable"
import { IdeaTableItem } from "@/hooks/react-query/domain/group/useIdeaTableItemsQueryUtils"
import { LinearProgress } from "@mui/material"

interface Props {
  isLoading: boolean
  subideasTableItems: IdeaTableItem[]
}

const SubideasTable = (props: Props) => {
  return (
    <div>
      {props.isLoading ? (
        <LinearProgress />
      ) : (
        <IdeaTable ideaRatings={props.subideasTableItems} isSubideasTable />
      )}
    </div>
  )
}

export default SubideasTable
