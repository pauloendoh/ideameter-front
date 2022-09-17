import SimpleUserDto from "@/types/domain/user/SimpleUserDto"
import { cookieKeys } from "@/utils/cookieKeys"
import nookies from "nookies"
import { pushOrRemove } from "utils/array/pushOrRemove"
import create from "zustand"

interface IGroupFilterStore {
  // filter
  filter: {
    labelIds: string[]
    hidingDone: boolean
    users: SimpleUserDto[]
    onlyHighImpactVoted: boolean
  }

  getFilterCount: () => number
  labelIdIsInFilter: (id: string) => boolean

  // ↓ ↓ ↓ saves tab ideas store in cookie after changing
  toggleFilterLabelId: (id: string, tabId?: string) => void
  toggleHidingDone: (tabId?: string) => void
  changeFilterUsers: (users: SimpleUserDto[], tabId?: string) => void
  toggleOnlyHighImpactVoted: (tabId?: string) => void
}

const useGroupFilterStore = create<IGroupFilterStore>((set, get) => ({
  filter: {
    hidingDone: false,
    labelIds: [],
    users: [],
    onlyHighImpactVoted: false,
  },

  getFilterCount: () => {
    const { labelIds, hidingDone, onlyHighImpactVoted } = get().filter
    let count = labelIds.length
    if (hidingDone) count++
    if (onlyHighImpactVoted) count++

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

  toggleHidingDone: (tabId) => {
    const { filter } = get()

    set({
      filter: {
        ...filter,
        hidingDone: !filter.hidingDone,
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
}))

const initialState = useGroupFilterStore.getState()
export const resetGroupFilterStore = () => {
  useGroupFilterStore.setState(initialState, true)
}

export default useGroupFilterStore
