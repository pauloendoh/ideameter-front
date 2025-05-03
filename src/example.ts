import { useFilterAndSortIdeaRatings } from "./components/GroupPage/GroupTabContent/IdeaTable/useFilterAndSortIdeaRatings/useFilterAndSortIdeaRatings"
import { useMyGhostRatingsQuery } from "./hooks/react-query/domain/group/ghost-rating/useMyGhostRatingsQuery"
import { useSaveGhostRatingMutation } from "./hooks/react-query/domain/group/ghost-rating/useSaveGhostRatingMutation"
import useAddLabelsToIdeasDialogStore from "./hooks/zustand/dialogs/useTransformToSubideadialogStore"

const hookTest = useFilterAndSortIdeaRatings
const dialogStore = useAddLabelsToIdeasDialogStore

const query = useMyGhostRatingsQuery
const mutation = useSaveGhostRatingMutation
