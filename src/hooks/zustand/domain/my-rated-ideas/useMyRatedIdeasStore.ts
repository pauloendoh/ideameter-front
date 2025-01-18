import create from "zustand"
import { MyRatedIdeasSortingByType } from "./MyRatedIdeasSortingByType/MyRatedIdeasSortingByType"

interface IStore {
  sortingBy: MyRatedIdeasSortingByType
  setSortingBy: (sortingBy: MyRatedIdeasSortingByType) => void
}

export const useMyRatedIdeasStore = create<IStore>((set, get) => ({
  sortingBy: "result",
  setSortingBy: (sortingBy) => set({ sortingBy }),
}))
