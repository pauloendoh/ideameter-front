import useSelectedIdeasStore from "@/hooks/zustand/domain/idea/useSelectedIdeasStore"

const useMultiSelectIdeas = () => {
  const { selectedIdeaIds, setSelectedIdeaIds, onCtrlClick, onShiftClick } =
    useSelectedIdeasStore()

  const idIsSelected = (ideaId: string) => selectedIdeaIds.includes(ideaId)

  const clearSelectedIds = () => setSelectedIdeaIds([])

  return { onCtrlClick, onShiftClick, idIsSelected, clearSelectedIds }
}

export default useMultiSelectIdeas
