import { pushOrRemove } from "utils/array/pushOrRemove";
import create from "zustand";

interface IGroupFilterStore {
  // filter
  filter: {
    byText: string;
    labelIds: string[];
    hidingDone: boolean;
    currentGoal: boolean;
  };

  getFilterCount: () => number;
  filterLabelIds: (ids: string[]) => void;
  toggleFilterLabelId: (id: string) => void;
  labelIdIsInFilter: (id: string) => boolean;

  setFilterByText: (text: string) => void;
  toggleHidingDone: () => void;
  toggleFilterCurrentGoal: () => void;
}

const useGroupFilterStore = create<IGroupFilterStore>((set, get) => ({
  filter: {
    hidingDone: false,
    byText: "",
    labelIds: [],
    currentGoal: false,
  },

  getFilterCount: () => {
    const { labelIds, hidingDone, currentGoal } = get().filter;
    let count = labelIds.length;
    if (hidingDone) count++;
    if (currentGoal) count++;

    return count;
  },
  filterLabelIds: (ids) => {
    set((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        labelIds: ids,
      },
    }));
  },
  toggleFilterLabelId: (id) => {
    const { filter } = get();
    const newLabelIds = pushOrRemove(filter.labelIds, id);

    set({
      filter: {
        ...filter,
        labelIds: newLabelIds,
      },
    });
  },

  labelIdIsInFilter: (id) => {
    return get().filter.labelIds.includes(id);
  },

  setFilterByText: (text) => {
    set((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        byText: text,
      },
    }));
  },
  toggleHidingDone: () => {
    const { filter } = get();

    set({
      filter: {
        ...filter,
        hidingDone: !filter.hidingDone,
      },
    });
  },
  toggleFilterCurrentGoal: () => {
    const { filter } = get();

    set({
      filter: {
        ...filter,
        currentGoal: !filter.currentGoal,
      },
    });
  },
}));

const initialState = useGroupFilterStore.getState();
export const resetGroupFilterStore = () => {
  useGroupFilterStore.setState(initialState, true);
};

export default useGroupFilterStore;
