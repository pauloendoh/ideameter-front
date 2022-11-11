import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import { buildIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto"
import { useHotkeys } from "react-hotkeys-hook"

export const useNewIdeaHotkey = (tabId: string) => {
  const { openDialog, dialogIsOpen } = useIdeaDialogStore()

  return useHotkeys(
    "q",
    () => {
      if (!dialogIsOpen) openDialog(buildIdeaDto({ tabId: tabId }))
    },
    [dialogIsOpen, tabId]
  )
}
