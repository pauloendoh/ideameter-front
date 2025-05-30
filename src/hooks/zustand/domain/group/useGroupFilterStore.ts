import { ISortOption } from "@/types/domain/idea/IdeaSortingTypes"
import SimpleUserDto from "@/types/domain/user/SimpleUserDto"
import { cookieKeys } from "@/utils/cookieKeys"
import nookies from "nookies"
import { pushOrRemove } from "utils/array/pushOrRemove"
import create from "zustand"

export interface IFilter {
  labelIds: string[]
  excludeLabelIds: string[]
  onlyGhostRatings: boolean
  onlyCompletedIdeas: boolean
  users: SimpleUserDto[]
  votedHighImpactBy: string | null
  requiresYourRating: boolean
  minRatingCount: number
  minAvgRating: number

  onlyShowRatingsByMemberIds: string[]
}

export interface IStore {
  filter: IFilter
  setFilter: (filter: IFilter) => void

  getFilterCount: () => number
  labelIdIsInFilter: (id: string) => boolean

  // ↓ ↓ ↓ saves tab ideas store in cookie after changing
  toggleFilterLabelId: (id: string, tabId: string) => void
  setFilterLabelIds: (ids: string[], tabId: string) => void
  setExcludeLabelIds: (ids: string[], tabId: string) => void
  toggleOnlyCompletedIdeas: (tabId: string) => void
  toggleGhostRatings: (tabId: string) => void
  changeFilterUsers: (users: SimpleUserDto[], tabId: string) => void
  toggleRequiresYourRating: (tabId: string) => void
  setMinRatingCount: (count: number, tabId: string) => void
  setMinAvgRating: (value: number, tabId: string) => void
  setVotedHighImpactBy: (userId: string | null, tabId: string) => void

  sortingBy: ISortOption
  setSortingBy: (sortingBy: ISortOption, tabId: string) => void

  setOnlyShowRatingsByMemberIds: (ids: string[], tabId: string) => void
}

const useGroupFilterStore = create<IStore>((set, get) => ({
  filter: {
    onlyCompletedIdeas: false,
    labelIds: [],
    excludeLabelIds: [],
    users: [],
    onlyGhostRatings: false,
    onlyHighImpactVoted: false,
    onlyShowRatingsByMemberIds: [],
    requiresYourRating: false,
    minRatingCount: 0,
    minAvgRating: 0,
    votedHighImpactBy: null,
  },
  setFilter: (filter) => set({ filter }),
  getFilterCount: () => {
    const {
      labelIds,
      excludeLabelIds,
      votedHighImpactBy,
      requiresYourRating,
      minRatingCount,
      minAvgRating,
      onlyShowRatingsByMemberIds,
    } = get().filter
    let count = labelIds?.length + excludeLabelIds?.length

    if (requiresYourRating) count++
    if (minRatingCount > 0) count++
    if (minAvgRating > 0) count++
    if (votedHighImpactBy) {
      count++
    }

    if (onlyShowRatingsByMemberIds?.length) {
      count++
    }

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

    const state = get()
    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },

  setFilterLabelIds: (ids, tabId) => {
    const { filter } = get()
    set({
      filter: {
        ...filter,
        labelIds: ids,
      },
    })

    const state = get()
    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },

  setExcludeLabelIds: (ids, tabId) => {
    const { filter } = get()
    set({
      filter: {
        ...filter,
        excludeLabelIds: ids,
      },
    })

    const state = get()
    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },

  labelIdIsInFilter: (id) => {
    return get().filter.labelIds.includes(id)
  },

  toggleGhostRatings: (tabId) => {
    const { filter } = get()

    set({
      filter: {
        ...filter,
        onlyGhostRatings: !filter.onlyGhostRatings,
      },
    })

    const state = get()
    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },

  toggleOnlyCompletedIdeas: (tabId) => {
    const { filter } = get()

    set({
      filter: {
        ...filter,
        onlyCompletedIdeas: !filter.onlyCompletedIdeas,
      },
    })

    const state = get()

    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },
  changeFilterUsers: (userIds, tabId) => {
    set((curr) => ({
      filter: {
        ...curr.filter,
        users: userIds,
      },
    }))

    const state = get()
    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },

  toggleRequiresYourRating: (tabId) => {
    set((curr) => ({
      filter: {
        ...curr.filter,
        requiresYourRating: !curr.filter.requiresYourRating,
      },
    }))

    const state = get()
    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },

  setMinRatingCount: (count, tabId) => {
    set((curr) => ({
      filter: {
        ...curr.filter,
        minRatingCount: count,
      },
    }))

    const state = get()
    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },

  setMinAvgRating(value, tabId) {
    set((curr) => ({
      filter: {
        ...curr.filter,
        minAvgRating: value,
      },
    }))

    // PE 1/3 - DRY
    const state = get()
    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },

  setVotedHighImpactBy(userId, tabId) {
    set((curr) => ({
      filter: {
        ...curr.filter,
        votedHighImpactBy: userId,
      },
    }))

    const state = get()
    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },

  sortingBy: {
    attribute: "avgRating",
    order: "desc",
  },
  setSortingBy: (sortingBy, tabId) => {
    set({ sortingBy })
    const state = get()
    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },

  setOnlyShowRatingsByMemberIds(ids, tabId) {
    set((curr) => ({
      filter: {
        ...curr.filter,
        onlyShowRatingsByMemberIds: ids,
      },
    }))

    const state = get()
    nookies.set(
      null,
      cookieKeys.groupTabIdeasFilter(tabId),
      JSON.stringify(state)
    )
  },
}))

const initialState = useGroupFilterStore.getState()
export const resetGroupFilterStore = () => {
  useGroupFilterStore.setState(initialState, true)
}

export default useGroupFilterStore
