import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import { IdeaChangeDto } from "@/hooks/react-query/domain/idea-change/useIdeaChangesQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import { Typography } from "@mui/material"
import { useMemo } from "react"
import { format } from "timeago.js"

type Props = {
  ideaChange: IdeaChangeDto
  isSelected: boolean
  onClick: () => void
}

const IdeaChangeDialogItemLeft = (props: Props) => {
  const { groupId } = useRouterQueryString()

  const changedLabel = useMemo(() => {
    if (props.ideaChange.changeType === "Title") {
      return "Changed title"
    }

    return "Changed description"
  }, [props.ideaChange.changeType])

  return (
    <FlexCol
      sx={(theme) => ({
        cursor: "pointer",
        borderRadius: 1,
        padding: 1,
        paddingX: 2,
        width: "100%",
        backgroundColor: props.isSelected
          ? theme.palette.grey[800]
          : "transparent",
      })}
      onClick={props.onClick}
    >
      <FlexVCenter gap={1}>
        {groupId && (
          <UserGroupAvatar
            groupId={groupId}
            userId={props.ideaChange.userId}
            widthAndHeight={32}
          />
        )}

        {changedLabel}
      </FlexVCenter>
      <Typography fontSize={12} textAlign="end">
        {format(props.ideaChange.createdAt)}
      </Typography>
    </FlexCol>
  )
}

export default IdeaChangeDialogItemLeft
