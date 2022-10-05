import create from "zustand"

interface ISelectedIdeasStore {
  selectedIdeaIds: string[]
  setSelectedIdeaIds: (ids: string[]) => void
}

const useSelectedIdeasStore = create<ISelectedIdeasStore>((set) => ({
  selectedIdeaIds: [],
  setSelectedIdeaIds: (selectedIdeaIds) => set({ selectedIdeaIds }),
}))

const initialState = useSelectedIdeasStore.getState()
export const resetSelectedIdeasStore = () => {
  useSelectedIdeasStore.setState(initialState, true)
}

export default useSelectedIdeasStore
