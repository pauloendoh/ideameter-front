import { ISortOption } from "@/types/domain/idea/IdeaSortingTypes";
import create from "zustand";

interface IIdeaSortStore {
  sortingBy: ISortOption;
  setSortingBy: (sortingBy: ISortOption) => void;
}

const useIdeaSortStore = create<IIdeaSortStore>((set, get) => ({
  sortingBy: {
    attribute: "avgRating",
    order: "desc",
  },
  setSortingBy: (sortingBy) => set({ sortingBy }),
}));

const initialState = useIdeaSortStore.getState();
export const resetIdeaSortStore = () => {
  useIdeaSortStore.setState(initialState, true);
};

export default useIdeaSortStore;
