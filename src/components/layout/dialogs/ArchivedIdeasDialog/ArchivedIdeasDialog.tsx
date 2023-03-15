import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useArchivedIdeasQuery from "@/hooks/react-query/domain/archived-idea/useArchivedIdeasQuery"
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString"
import useArchivedIdeasDialogStore from "@/hooks/zustand/dialogs/useArchivedIdeasDialogStore"
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import { useEffect, useMemo } from "react"
import { MdClose } from "react-icons/md"

const ariaLabel = "archived-ideas-dialog"

const ArchivedIdeasDialog = () => {
  const { dialogIsOpen, closeDialog } = useArchivedIdeasDialogStore()

  const { groupId } = useRouterQueryString()

  const { data: archivedIdeas, refetch } = useArchivedIdeasQuery(groupId)

  const { openDialog: openIdeaDialog } = useIdeaDialogStore()

  useEffect(() => {
    if (dialogIsOpen) {
      refetch()
    }
  }, [dialogIsOpen])

  const sorted = useMemo(
    () =>
      archivedIdeas?.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) ||
      [],
    [archivedIdeas]
  )

  return (
    <Dialog
      open={dialogIsOpen}
      onClose={closeDialog}
      fullWidth
      maxWidth="xs"
      aria-labelledby={ariaLabel}
    >
      <Box pb={1}>
        <DialogTitle id={`${ariaLabel}-title`}>
          <FlexVCenter justifyContent="space-between">
            <Typography variant="h5">Archived ideas</Typography>

            <IconButton onClick={closeDialog}>
              <MdClose />
            </IconButton>
          </FlexVCenter>
        </DialogTitle>

        <DialogContent>
          <FlexCol gap={1}>
            {sorted?.map((idea) => (
              <DarkButton
                key={idea.id}
                onClick={() => {
                  openIdeaDialog(idea)
                }}
                sx={{
                  justifyContent: "flex-start",
                }}
              >
                {idea.name}
              </DarkButton>
            ))}
          </FlexCol>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default ArchivedIdeasDialog
