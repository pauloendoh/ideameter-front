import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaTable/UserTableCell/UserGroupAvatar/UserGroupAvatar"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import TimeagoSpan from "@/components/_common/text/TimeagoSpan"
import useIdeaChangesQuery from "@/hooks/react-query/domain/idea-change/useIdeaChangesQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useIdeaChangesDialogStore from "@/hooks/zustand/dialogs/useIdeaChangesDialogStore"
import { Typography } from "@mui/material"
import { useMemo } from "react"
import { format } from "timeago.js"

type Props = {
  ideaId: string
  ideaTitle: string
  createdAt: string
  updatedAt: string
  creatorId: string
}

const CreatedUpdatedAtIdeaDialog = (props: Props) => {
  const { openDialog: openIdeaChangesDialog } = useIdeaChangesDialogStore()

  const { data: ideaChanges } = useIdeaChangesQuery(props.ideaId)

  const mostRecentIdeaChange = useMemo(() => {
    return ideaChanges?.sort((a, b) => {
      return a.createdAt > b.createdAt ? -1 : 1
    })[0]
  }, [ideaChanges])

  const { groupId } = useRouterQueryString()

  const date = useMemo(() => {
    return mostRecentIdeaChange
      ? mostRecentIdeaChange.createdAt
      : props.updatedAt
  }, [mostRecentIdeaChange, props.createdAt])

  const imageUserId = useMemo(() => {
    return mostRecentIdeaChange ? mostRecentIdeaChange.userId : props.creatorId
  }, [mostRecentIdeaChange, props.creatorId])

  return (
    <FlexVCenter gap={1}>
      <FlexCol gap={1}>
        {ideaChanges && ideaChanges.length > 0 && (
          <FlexVCenter gap={1}>
            <UserGroupAvatar
              groupId={groupId}
              userId={imageUserId}
              widthAndHeight={24}
            />

            <Typography
              sx={() => ({
                cursor: "pointer",
                ":hover": {
                  textDecoration: "underline",
                },
              })}
              onClick={() =>
                openIdeaChangesDialog({
                  ideaId: props.ideaId,
                  ideaTitle: props.ideaTitle,
                })
              }
            >
              Updated {format(date)}
            </Typography>
          </FlexVCenter>
        )}

        <FlexVCenter gap={1}>
          <UserGroupAvatar
            groupId={groupId}
            userId={props.creatorId}
            widthAndHeight={24}
          />

          <Typography>
            Created <TimeagoSpan createdAt={props.createdAt} />
          </Typography>
        </FlexVCenter>
      </FlexCol>
    </FlexVCenter>
  )
}

export default CreatedUpdatedAtIdeaDialog
