import { useFilterAndSortIdeaRatings } from "./components/GroupPage/GroupTabContent/IdeaTable/useFilterAndSortIdeaRatings/useFilterAndSortIdeaRatings"
import useIdeaChangesQuery from "./hooks/react-query/domain/idea-change/useIdeaChangesQuery"
import useSaveLabelsBatchMutation from "./hooks/react-query/domain/label/useSaveLabelsBatchMutation"
import useTransformToSubideadialogStore from "./hooks/zustand/dialogs/useTransformToSubideadialogStore"

const hookTest = useFilterAndSortIdeaRatings
const dialogStore = useTransformToSubideadialogStore

const query = useIdeaChangesQuery
const mutation = useSaveLabelsBatchMutation
