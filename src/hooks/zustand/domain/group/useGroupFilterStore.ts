import SimpleUserDto from "@/types/domain/user/SimpleUserDto"
import { cookieKeys } from "@/utils/cookieKeys"
import nookies from "nookies"
import { pushOrRemove } from "utils/array/pushOrRemove"
import create from "zustand"

export interface IFilter {
  labelIds: string[]
  onlyCompletedIdeas: boolean
  users: SimpleUserDto[]
  onlyHighImpactVoted: boolean
  requiresYourRating: boolean
  minRatingCount: number
  minAvgRating: number
}

export interface IGroupFilterStore {
  filter: IFilter
  setFilter: (filter: IFilter) => void

  getFilterCount: () => number
  labelIdIsInFilter: (id: string) => boolean

  // ↓ ↓ ↓ saves tab ideas store in cookie after changing
  toggleFilterLabelId: (id: string, tabId?: string) => void
  toggleOnlyCompletedIdeas: (tabId?: string) => void
  changeFilterUsers: (users: SimpleUserDto[], tabId?: string) => void
  toggleOnlyHighImpactVoted: (tabId?: string) => void
  toggleRequiresYourRating: (tabId?: string) => void
  setMinRatingCount: (count: number, tabId?: string) => void
  setMinAvgRating: (value: number, tabId?: string) => void
}

const useGroupFilterStore = create<IGroupFilterStore>((set, get) => ({
  filter: {
    onlyCompletedIdeas: false,
    labelIds: [],
    users: [],
    onlyHighImpactVoted: false,
    requiresYourRating: false,
    minRatingCount: 0,
    minAvgRating: 0,
  },
  setFilter: (filter) => set({ filter }),
  getFilterCount: () => {
    const {
      labelIds,
      onlyHighImpactVoted,
      requiresYourRating,
      minRatingCount,
      minAvgRating,
    } = get().filter
    let count = labelIds.length
    if (onlyHighImpactVoted) count++
    if (requiresYourRating) count++
    if (minRatingCount > 0) count++
    if (minAvgRating > 0) count++

    return count
  },

  toggleFilterLabelId: (id, tabId) => {
    const { filter } = get()
    const newLabelIds = pushOrRemove(filter.labelIds, id)

    set({
      filter: {
        ...filter,
        labelIds: newLabelIds,
      },
    })

    if (tabId) {
      const state = get()
      nookies.set(
        null,
        cookieKeys.groupTabIdeasFilter(tabId),
        JSON.stringify(state)
      )
    }
  },

  labelIdIsInFilter: (id) => {
    return get().filter.labelIds.includes(id)
  },

  toggleOnlyCompletedIdeas: (tabId) => {
    const { filter } = get()

    set({
      filter: {
        ...filter,
        onlyCompletedIdeas: !filter.onlyCompletedIdeas,
      },
    })

    if (tabId) {
      const state = get()

      nookies.set(
        null,
        cookieKeys.groupTabIdeasFilter(tabId),
        JSON.stringify(state)
      )
    }
  },
  changeFilterUsers: (userIds, tabId) => {
    set((curr) => ({
      filter: {
        ...curr.filter,
        users: userIds,
      },
    }))

    if (tabId) {
      const state = get()
      nookies.set(
        null,
        cookieKeys.groupTabIdeasFilter(tabId),
        JSON.stringify(state)
      )
    }
  },
  toggleOnlyHighImpactVoted: (tabId) => {
    set((curr) => ({
      filter: {
        ...curr.filter,
        onlyHighImpactVoted: !curr.filter.onlyHighImpactVoted,
      },
    }))

    if (tabId) {
      const state = get()
      nookies.set(
        null,
        cookieKeys.groupTabIdeasFilter(tabId),
        JSON.stringify(state)
      )
    }
  },
  toggleRequiresYourRating: (tabId) => {
    set((curr) => ({
      filter: {
        ...curr.filter,
        requiresYourRating: !curr.filter.requiresYourRating,
      },
    }))

    if (tabId) {
      const state = get()
      nookies.set(
        null,
        cookieKeys.groupTabIdeasFilter(tabId),
        JSON.stringify(state)
      )
    }
  },

  setMinRatingCount: (count, tabId) => {
    set((curr) => ({
      filter: {
        ...curr.filter,
        minRatingCount: count,
      },
    }))

    if (tabId) {
      const state = get()
      nookies.set(
        null,
        cookieKeys.groupTabIdeasFilter(tabId),
        JSON.stringify(state)
      )
    }
  },

  setMinAvgRating(value, tabId) {
    set((curr) => ({
      filter: {
        ...curr.filter,
        minAvgRating: value,
      },
    }))

    if (tabId) {
      const state = get()
      nookies.set(
        null,
        cookieKeys.groupTabIdeasFilter(tabId),
        JSON.stringify(state)
      )
    }
  },
}))

const initialState = useGroupFilterStore.getState()
export const resetGroupFilterStore = () => {
  useGroupFilterStore.setState(initialState, true)
}

export default useGroupFilterStore
