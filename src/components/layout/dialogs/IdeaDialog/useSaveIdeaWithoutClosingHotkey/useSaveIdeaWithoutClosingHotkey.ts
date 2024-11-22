import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"

import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import { useHotkeys } from "react-hotkeys-hook"

export const useSaveIdeaWithoutClosingHotkey = (params: {
  saveWithoutClosing: () => void
  ideaDto: IdeaDto
  dialogIsOpen: boolean
  savingIsDisabled: boolean
}) => {
  const { saveWithoutClosing, ideaDto: watch, dialogIsOpen } = params

  const { setErrorMessage } = useSnackbarStore()

  useHotkeys(
    ["ctrl+s", "meta+s"],
    (e) => {
      if (dialogIsOpen) {
        e.preventDefault()

        if (params.savingIsDisabled) {
          setErrorMessage(
            "Saving is disabled. Please fill in the required fields."
          )
          return
        }

        saveWithoutClosing()
      }
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    },
    [saveWithoutClosing, watch, dialogIsOpen]
  )
}
