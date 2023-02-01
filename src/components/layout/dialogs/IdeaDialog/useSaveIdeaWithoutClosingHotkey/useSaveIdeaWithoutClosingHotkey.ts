import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { useHotkeys } from "react-hotkeys-hook"

export const useSaveIdeaWithoutClosingHotkey = (params: {
  saveWithoutClosing: () => void
  ideaDto: IdeaDto
  dialogIsOpen: boolean
}) => {
  const { saveWithoutClosing, ideaDto: watch, dialogIsOpen } = params

  useHotkeys(
    "ctrl+s",
    (e) => {
      if (dialogIsOpen) {
        e.preventDefault()
        saveWithoutClosing()
      }
    },
    {
      enableOnTags: ["INPUT", "TEXTAREA", "SELECT"],
    },
    [saveWithoutClosing, watch, dialogIsOpen]
  )
}
