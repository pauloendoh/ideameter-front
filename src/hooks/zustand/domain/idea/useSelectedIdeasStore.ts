import create from "zustand"

interface ISelectedIdeasStore {
  selectedIdeaIds: string[]
  setSelectedIdeaIds: (ids: string[]) => void
  onCtrlClick: (ideaId: string) => void
  onShiftClick: (ideaIds: string[], selectedId: string) => void
}

const useSelectedIdeasStore = create<ISelectedIdeasStore>((set, get) => ({
  selectedIdeaIds: [],
  setSelectedIdeaIds: (selectedIdeaIds) => set({ selectedIdeaIds }),

  onCtrlClick: (ideaId: string) => {
    const { selectedIdeaIds, setSelectedIdeaIds } = get()

    const ids = [...selectedIdeaIds]

    // remove
    if (selectedIdeaIds.includes(ideaId))
      setSelectedIdeaIds(ids.filter((id) => id !== ideaId))
    // add
    else setSelectedIdeaIds([...ids, ideaId])
  },

  onShiftClick: (ideaIds: string[], selectedId: string) => {
    const { selectedIdeaIds, setSelectedIdeaIds } = get()

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
  },
}))

const initialState = useSelectedIdeasStore.getState()
export const resetSelectedIdeasStore = () => {
  useSelectedIdeasStore.setState(initialState, true)
}

export default useSelectedIdeasStore
