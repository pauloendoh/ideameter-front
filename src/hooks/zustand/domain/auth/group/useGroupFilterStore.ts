import { pushOrRemove } from "utils/array/pushOrRemove";
import create from "zustand";

interface IGroupFilterStore {
  // filter
  filter: {
    byText: string;
    labelIds: string[];
    hidingDone: boolean;
  };

  getFilterCount: () => number;
  filterLabelIds: (ids: string[]) => void;
  toggleFilterLabelId: (id: string) => void;
  labelIdIsInFilter: (id: string) => boolean;

  setFilterByText: (text: string) => void;
  toggleHidingDone: () => void;
}

const useGroupFilterStore = create<IGroupFilterStore>((set, get) => ({
  filter: {
    hidingDone: false,
    byText: "",
    labelIds: [],
  },

  getFilterCount: () => {
    const { labelIds, hidingDone } = get().filter;
    let count = labelIds.length;
    if (hidingDone) count++;

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
}));

const initialState = useGroupFilterStore.getState();
export const resetGroupFilterStore = () => {
  useGroupFilterStore.setState(initialState, true);
};

export default useGroupFilterStore;
