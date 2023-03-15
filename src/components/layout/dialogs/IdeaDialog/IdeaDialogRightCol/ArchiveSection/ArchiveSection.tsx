import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import useDeleteIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useDeleteIdeaMutation"
import useConfirmDialogStore from "@/hooks/zustand/dialogs/useConfirmDialogStore"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import { Button } from "@mui/material"
import { useMemo } from "react"
import { MdArchive, MdDelete, MdKeyboardReturn } from "react-icons/md"

type Props = {
  ideaId: string
  groupId: string
  isArchived: boolean
  onToggleArchive: () => void
}

const ArchiveSection = (props: Props) => {
  const icon = useMemo(() => {
    return props.isArchived ? <MdKeyboardReturn /> : <MdArchive />
  }, [props.isArchived])

  const buttonLabel = useMemo(() => {
    return props.isArchived ? "Restore to board" : "Archive"
  }, [props.isArchived])

  const { mutate: submitDeleteIdea } = useDeleteIdeaMutation()
  const openConfirmDialog = useConfirmDialogStore((s) => s.openConfirmDialog)
  const { closeDialog, initialValue } = useIdeaDialogStore()

  const handleDelete = () => {
    openConfirmDialog({
      title: "Delete idea?",
      onConfirm: () => {
        submitDeleteIdea(
          { idea: initialValue },
          {
            onSuccess: () => {
              closeDialog()
            },
          }
        )
      },
    })
  }

  return (
    <FlexCol gap={1}>
      <DarkButton
        startIcon={icon}
        sx={{
          justifyContent: "flex-start",
          pl: 2,
        }}
        onClick={props.onToggleArchive}
      >
        {buttonLabel}
      </DarkButton>
      {props.isArchived && (
        <Button
          sx={{
            justifyContent: "flex-start",
            pl: 2,
          }}
          variant="contained"
          color="error"
          startIcon={<MdDelete />}
          onClick={handleDelete}
        >
          Delete idea
        </Button>
      )}
    </FlexCol>
  )
}

export default ArchiveSection
