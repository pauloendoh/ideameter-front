import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import { useAxios } from "@/utils/axios/useAxios"
import urls from "@/utils/urls"
import { useMutation, useQueryClient } from "react-query"
import { UserSettingsDto } from "./useIdeaChangesQuery"

const useUpdateHiddenTabsIdsMutation = () => {
  const queryClient = useQueryClient()
  const { setSuccessMessage, setErrorMessage } = useSnackbarStore()

  const axios = useAxios()
  return useMutation(
    ({ tabsIds }: { tabsIds: string[] }) =>
      axios
        .put<UserSettingsDto>(urls.api.userSettingsHiddenTabsIds, {
          hiddenTabsIds: tabsIds,
        })
        .then((res) => res.data),
    {
      onSuccess: (savedSettings) => {
        queryClient.setQueryData(urls.api.userSettings, savedSettings)
      },
    }
  )
}

export default useUpdateHiddenTabsIdsMutation
