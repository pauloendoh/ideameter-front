import useSelectedIdeasStore from "@/hooks/zustand/domain/idea/useSelectedIdeasStore"

const useMultiSelectIdeas = () => {
  const { selectedIdeaIds, setSelectedIdeaIds } = useSelectedIdeasStore()

  const onCtrlClick = (ideaId: string) => {
    const ids = [...selectedIdeaIds]

    // remove
    if (selectedIdeaIds.includes(ideaId))
      setSelectedIdeaIds(ids.filter((id) => id !== ideaId))
    // add
    else setSelectedIdeaIds([...ids, ideaId])
  }

  const idIsSelected = (ideaId: string) => selectedIdeaIds.includes(ideaId)

  const clearSelectedIds = () => setSelectedIdeaIds([])

  const onShiftClick = (ideaIds: string[], selectedId: string) => {
    if (selectedIdeaIds.length === 0) {
      setSelectedIdeaIds([selectedId])
      return
    }

    if (selectedIdeaIds.length === 1 && selectedIdeaIds[0] === selectedId) {
      setSelectedIdeaIds([])
      return
    }

    if (selectedIdeaIds.includes(selectedId)) {
      setSelectedIdeaIds([selectedId])
      return
    }

    const firstSelectedIdx = ideaIds.findIndex((id) =>
      selectedIdeaIds.includes(id)
    )
    const lastSelectedId = [...ideaIds]
      .reverse()
      .find((id) => selectedIdeaIds.includes(id))
    const lastSelectedIdx = [...ideaIds].findIndex(
      (id) => id === lastSelectedId
    )

    const clickedIdx = [...ideaIds].findIndex((id) => id === selectedId)

    const finalIds = ideaIds.filter((_, idx) => {
      if (firstSelectedIdx < clickedIdx)
        return idx >= firstSelectedIdx && idx <= clickedIdx

      return idx >= clickedIdx && idx <= lastSelectedIdx
    })

    setSelectedIdeaIds(finalIds)
  }

  return { onCtrlClick, onShiftClick, idIsSelected, clearSelectedIds }
}

export default useMultiSelectIdeas
