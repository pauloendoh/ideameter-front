import MyTextField from "@/components/_common/inputs/MyTextField"
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery"
import useUserSettingsQuery from "@/hooks/react-query/domain/user-settings/useIdeaChangesQuery"
import useUpdateHiddenTabsIdsMutation from "@/hooks/react-query/domain/user-settings/useUpdateHiddenTabsIdsMutation"
import useHideTabsDialogStore from "@/hooks/zustand/dialogs/useHideTabsDialogStore"
import { LoadingButton } from "@mui/lab"
import {
  Autocomplete,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import HiddenTabsSection from "./HiddenTabsSection/HiddenTabsSection"

const ariaLabel = "hide-tabs-dialog"

const HideTabsDialog = () => {
  const { dialogIsOpen, closeDialog } = useHideTabsDialogStore()

  const [selectedGroupId, setSelectedGroupId] = useState("")
  const [selectedTabId, setSelectedTabId] = useState("")

  const { data: groups } = useGroupsQuery()

  const groupsWithTabs = useMemo(() => {
    return groups?.filter((group) => group.tabs && group.tabs.length > 0) || []
  }, [groups])

  const visibleTabs = useMemo(() => {
    return groups?.find((group) => group.id === selectedGroupId)?.tabs || []
  }, [groups, selectedGroupId])

  const { data: settings } = useUserSettingsQuery()

  useEffect(() => {
    setSelectedTabId("")
  }, [selectedGroupId])

  const addingIsEnabled = useMemo(() => {
    if (!settings) return false
    if (!selectedGroupId) return false
    if (!selectedTabId) return false

    if (settings.hiddenTabsIds.includes(selectedTabId)) return false

    return true
  }, [settings, selectedTabId, selectedGroupId])

  const { mutate, isLoading } = useUpdateHiddenTabsIdsMutation()

  const submitHideTab = () => {
    const newTabsIds = [...(settings?.hiddenTabsIds ?? []), selectedTabId]
    mutate({
      tabsIds: newTabsIds,
    })
  }

  return (
    <Dialog
      open={dialogIsOpen}
      onClose={closeDialog}
      fullWidth
      maxWidth="xs"
      aria-labelledby={ariaLabel}
    >
      <DialogTitle>Hide tabs</DialogTitle>
      <DialogContent>
        <FormControl sx={{ mt: 1 }} fullWidth size="small">
          <Autocomplete
            id={"group-selector-select"}
            options={groupsWithTabs}
            getOptionLabel={(option) => option.name}
            onChange={(e, group) => {
              if (group === null || group.id === undefined) {
                setSelectedGroupId("")
                return
              }
              setSelectedGroupId(group.id)
            }}
            renderInput={(params) => (
              <MyTextField
                {...params}
                label="Group"
                size="small"
                inputRef={null}
              />
            )}
          />
        </FormControl>

        <FormControl sx={{ mt: 2 }} fullWidth size="small">
          <Autocomplete
            id={"tab-selector-select"}
            options={visibleTabs}
            getOptionLabel={(option) => option.name}
            onChange={(e, tab) => {
              if (tab === null || tab.id === undefined) {
                setSelectedTabId("")
                return
              }
              setSelectedTabId(tab.id)
            }}
            renderInput={(params) => (
              <MyTextField
                {...params}
                label="Tab"
                size="small"
                inputRef={null}
              />
            )}
          />
        </FormControl>

        <LoadingButton
          sx={{
            mt: 2,
          }}
          disabled={!addingIsEnabled}
          color="primary"
          variant="contained"
          loading={isLoading}
          onClick={submitHideTab}
        >
          Hide
        </LoadingButton>

        {settings?.hiddenTabsIds && settings.hiddenTabsIds.length > 0 && (
          <Box>
            <Divider
              sx={{
                my: 2,
              }}
            />

            <HiddenTabsSection tabsIds={settings.hiddenTabsIds} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default HideTabsDialog
