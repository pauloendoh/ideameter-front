import { useFilterAndSortIdeaRatings } from "./components/GroupPage/GroupTabContent/IdeaTable/useFilterAndSortIdeaRatings/useFilterAndSortIdeaRatings"
import useIdeaChangesQuery from "./hooks/react-query/domain/idea-change/useIdeaChangesQuery"
import useSaveLabelsBatchMutation from "./hooks/react-query/domain/label/useSaveLabelsBatchMutation"
import useAddLabelsToIdeasDialogStore from "./hooks/zustand/dialogs/useTransformToSubideadialogStore"

const hookTest = useFilterAndSortIdeaRatings
const dialogStore = useAddLabelsToIdeasDialogStore

const query = useIdeaChangesQuery
const mutation = useSaveLabelsBatchMutation
