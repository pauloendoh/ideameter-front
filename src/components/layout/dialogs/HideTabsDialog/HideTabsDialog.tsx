import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery"
import useUserSettingsQuery from "@/hooks/react-query/domain/user-settings/useIdeaChangesQuery"
import useUpdateHiddenTabsIdsMutation from "@/hooks/react-query/domain/user-settings/useUpdateHiddenTabsIdsMutation"
import useHideTabsDialogStore from "@/hooks/zustand/dialogs/useHideTabsDialogStore"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
          <InputLabel id={"group-selector-label"}>Group</InputLabel>
          <Select
            labelId={"group-selector-label"}
            id={"group-selector-select"}
            label="Tab"
            size="small"
            value={selectedGroupId}
            onChange={(e) => {
              setSelectedGroupId(e.target.value as string)
            }}
          >
            {groupsWithTabs?.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ mt: 1 }} fullWidth size="small">
          <InputLabel id={ariaLabel + "-label"}>Tab</InputLabel>
          <Select
            labelId={ariaLabel + "-label"}
            id={ariaLabel + "-select"}
            label="Tab"
            size="small"
            value={selectedTabId}
            onChange={(e) => {
              setSelectedTabId(e.target.value as string)
            }}
          >
            {visibleTabs?.map((tab) => (
              <MenuItem key={tab.id} value={tab.id}>
                <FlexVCenter
                  justifyContent={"space-between"}
                  sx={{
                    width: "100%",
                  }}
                >
                  <span>{tab.name}</span>
                  {settings?.hiddenTabsIds.includes(tab.id) && (
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontStyle: "italic",
                      }}
                    >
                      Already hidden
                    </span>
                  )}
                </FlexVCenter>
              </MenuItem>
            ))}
          </Select>
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
