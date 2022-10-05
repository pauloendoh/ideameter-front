import { cookieKeys } from "@/utils/cookieKeys"
import nookies from "nookies"
import create from "zustand"
import { persist } from "zustand/middleware"

interface IAutoScrollStore {
  isDisabled: boolean
  toggleIsDisabled: () => void
}

const useAutoScrollStore = create(
  persist<IAutoScrollStore>(
    (set) => ({
      isDisabled: false,
      toggleIsDisabled: () => {
        set((curr) => ({
          isDisabled: !curr.isDisabled,
        }))
      },
    }),
    {
      name: "auto-scroll-store",
      getStorage: () => ({
        getItem: () => nookies.get(null)[cookieKeys.autoScrollStore],
        setItem: (name, value) => {
          nookies.set(null, name, value)
        },
        removeItem: () => {
          nookies.destroy(null, cookieKeys.autoScrollStore)
        },
      }),
    }
  )
)

export default useAutoScrollStore
