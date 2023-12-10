import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useGroupsQuery from "@/hooks/react-query/domain/group/useGroupsQuery"
import useUpdateHiddenTabsIdsMutation from "@/hooks/react-query/domain/user-settings/useUpdateHiddenTabsIdsMutation"
import { Typography } from "@mui/material"
import { useMemo } from "react"

type Props = {
  tabsIds: string[]
}

const HiddenTabsSection = ({ ...props }: Props) => {
  const { data: groups } = useGroupsQuery()

  const groupsWithHiddenTabs = useMemo(() => {
    return (
      groups?.filter(
        (group) =>
          group.tabs && group.tabs.some((tab) => props.tabsIds.includes(tab.id))
      ) || []
    )
  }, [groups, props.tabsIds])

  const { mutate } = useUpdateHiddenTabsIdsMutation()

  const removeHiddenTab = (tabId: string) => {
    const newTabsIds = props.tabsIds.filter((id) => id !== tabId)
    mutate({
      tabsIds: newTabsIds,
    })
  }

  return (
    <div className="HiddenTabsSection">
      <FlexCol gap={2}>
        {groupsWithHiddenTabs.map((group) => (
          <div key={group.id}>
            <Typography variant="h6">{group.name}</Typography>
            <div>
              {group.tabs
                ?.filter((tab) => props.tabsIds.includes(tab.id))
                .map((tab) => (
                  <FlexVCenter
                    key={tab.id}
                    width="100%"
                    justifyContent={"space-between"}
                  >
                    <span>{tab.name}</span>
                    <span
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontSize: "0.8rem",
                      }}
                      onClick={() => removeHiddenTab(tab.id)}
                    >
                      remove
                    </span>
                  </FlexVCenter>
                ))}
            </div>
          </div>
        ))}
      </FlexCol>
    </div>
  )
}

export default HiddenTabsSection
