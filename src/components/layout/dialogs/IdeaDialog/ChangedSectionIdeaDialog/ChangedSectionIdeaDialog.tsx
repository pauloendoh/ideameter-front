import useIdeaChangesQuery from "@/hooks/react-query/domain/idea-change/useIdeaChangesQuery"
import useIdeaChangesDialogStore from "@/hooks/zustand/dialogs/useIdeaChangesDialogStore"
import { Typography } from "@mui/material"
import { format } from "timeago.js"

type Props = {
  ideaId: string
  ideaTitle: string
  createdAt: string
  updatedAt: string
}

const ChangedSectionIdeaDialog = (props: Props) => {
  const { openDialog: openIdeaChangesDialog } = useIdeaChangesDialogStore()

  const { data: ideaChanges } = useIdeaChangesQuery(props.ideaId)

  if (ideaChanges && ideaChanges.length > 0) {
    return (
      <Typography
        sx={(theme) => ({
          color: theme.palette.primary.main,
          cursor: "pointer",
          textDecoration: "underline",
        })}
        onClick={() =>
          openIdeaChangesDialog({
            ideaId: props.ideaId,
            ideaTitle: props.ideaTitle,
          })
        }
      >
        Updated {format(props.updatedAt)}
      </Typography>
    )
  }

  return <Typography>Created {format(props.createdAt)}</Typography>
}

export default ChangedSectionIdeaDialog
