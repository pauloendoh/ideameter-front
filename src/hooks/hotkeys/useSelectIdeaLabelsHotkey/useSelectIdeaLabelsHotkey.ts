import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useSelectLabelsDialogStore from "@/hooks/zustand/dialogs/useSelectLabelsDialogStore"
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"
import queryKeys from "@/utils/queryKeys"
import { useHotkeys } from "react-hotkeys-hook"
import { useQueryClient } from "react-query"

export const useSelectIdeaLabelsHotkey = (ideaId: string | null) => {
  const { mutate: submitSaveIdea } = useSaveIdeaMutation()
  const { groupId } = useRouterQueryString()

  const queryClient = useQueryClient()

  const { openDialog, setSelectedLabels } = useSelectLabelsDialogStore()

  return useHotkeys(
    "l",
    () => {
      if (ideaId && groupId) {
        const groupIdeas = queryClient.getQueryData<IdeaDto[]>(
          queryKeys.groupIdeas(groupId)
        )
        if (!groupIdeas) return
        const idea = groupIdeas.find((i) => i.id === ideaId)
        if (!idea) return

        openDialog({
          groupId: groupId,
          selectedLabels: idea.labels,
          onChangeSelectedLabels: (newLabels) => {
            console.log({
              newLabels,
            })
            idea.labels = newLabels
            submitSaveIdea(idea)
            setSelectedLabels(newLabels)
          },
        })

        // submitSaveIdea(idea)
      }
    },
    [ideaId, groupId]
  )
}
