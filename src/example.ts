import { useFilterAndSortIdeaRatings } from "./components/GroupPage/GroupTabContent/IdeaRatingsTable/useFilterAndSortIdeaRatings/useFilterAndSortIdeaRatings"
import useIdeaChangesQuery from "./hooks/react-query/domain/idea-change/useIdeaChangesQuery"
import useTransformToSubideadialogStore from "./hooks/zustand/dialogs/useTransformToSubideadialogStore"

const hookTest = useFilterAndSortIdeaRatings
const dialogStore = useTransformToSubideadialogStore

const query = useIdeaChangesQuery
