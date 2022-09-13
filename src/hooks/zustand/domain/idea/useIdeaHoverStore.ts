import create from "zustand";

interface IIdeaHoverStore {
  hoveredIdeaId: string | null;
  setHoveredIdeaId: (val: string | null) => void;

  // after scrolling (useScrollToIdea)
}

const useIdeaHoverStore = create<IIdeaHoverStore>((set, get) => ({
  hoveredIdeaId: null,
  setHoveredIdeaId: (val) => set({ hoveredIdeaId: val }),
}));

const initialState = useIdeaHoverStore.getState();
export const resetIdeaHoverStore = () => {
  useIdeaHoverStore.setState(initialState, true);
};

export default useIdeaHoverStore;
