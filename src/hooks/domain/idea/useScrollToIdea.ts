import useAutoScrollStore from "@/hooks/zustand/useAutoScrollStore"
import { useTheme } from "@mui/material"
import { useState } from "react"

export const useScrollToIdea = () => {
  const theme = useTheme()

  const isDisabled = useAutoScrollStore((s) => s.isDisabled)

  const [
    removeClassTimeout,
    setRemoveClassTimeout,
  ] = useState<NodeJS.Timeout | null>(null)
  const scrollToIdea = (ideaId: string) => {
    setTimeout(() => {
      const row = document.querySelector<HTMLElement>(`#idea-${ideaId}`)
      const table = document.querySelector(".MuiTableContainer-root")
      const thead = document.querySelector<HTMLElement>(".MuiTableRow-head")

      if (row && table && thead && !isDisabled) {
        const tableTop = table.getBoundingClientRect().top
        const theadHeight = thead.offsetHeight

        const rowTop = row.getBoundingClientRect().top + table.scrollTop
        const top = rowTop - (tableTop + theadHeight)

        table.scrollTo({
          top: top,
        })

        row.classList.add("highlight-idea-row")

        if (removeClassTimeout) {
          clearTimeout(removeClassTimeout)
          setRemoveClassTimeout(null)
        }

        setRemoveClassTimeout(
          setTimeout(() => {
            const row = document.querySelector<HTMLElement>(`#idea-${ideaId}`)
            if (row) row.classList.remove("highlight-idea-row")
          }, 2000)
        )
      }
    }, 250)
  }

  return scrollToIdea
}
