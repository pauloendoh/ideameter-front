import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import useIdeaChangesQuery from "@/hooks/react-query/domain/idea-change/useIdeaChangesQuery"
import useIdeaChangesDialogStore from "@/hooks/zustand/dialogs/useIdeaChangesDialogStore"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { MdClose } from "react-icons/md"
import IdeaChangeDialogDetailsRight from "./IdeaChangeDialogDetailsRight/IdeaChangeDialogDetailsRight"
import IdeaChangeDialogItemLeft from "./IdeaChangeDialogItemLeft/IdeaChangeDialogItemLeft"

const ariaLabel = "idea-changes-dialog"

const IdeaChangesDialog = () => {
  const { initialValue, dialogIsOpen, closeDialog } =
    useIdeaChangesDialogStore()

  const { data: ideaChanges, refetch } = useIdeaChangesQuery(
    initialValue.ideaId
  )

  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null)

  const selectedIdeaChange = useMemo(() => {
    return ideaChanges?.find((ideaChange) => ideaChange.id === selectedIdeaId)
  }, [ideaChanges, selectedIdeaId])

  useEffect(() => {
    if (dialogIsOpen) {
      refetch()
    }
  }, [dialogIsOpen])

  return (
    <Dialog
      open={dialogIsOpen}
      onClose={closeDialog}
      fullWidth
      maxWidth="md"
      aria-labelledby={ariaLabel}
    >
      <Box pb={1}>
        <DialogTitle id={`${ariaLabel}-title`}>
          <FlexVCenter justifyContent="space-between">
            <Typography variant="h5">{initialValue.ideaTitle}</Typography>

            <IconButton onClick={closeDialog}>
              <MdClose />
            </IconButton>
          </FlexVCenter>
        </DialogTitle>

        <DialogContent>
          <Flex gap={2}>
            <FlexCol width="40%">
              <Typography sx={{ fontWeight: 600 }}>Change history</Typography>

              <FlexCol mt={2} gap={1} width="100%">
                {ideaChanges?.map((ideaChange) => (
                  <IdeaChangeDialogItemLeft
                    key={ideaChange.id}
                    ideaChange={ideaChange}
                    isSelected={ideaChange.id === selectedIdeaId}
                    onClick={() => setSelectedIdeaId(ideaChange.id)}
                  />
                ))}
              </FlexCol>
            </FlexCol>
            <div
              style={{
                width: 1,
                backgroundColor: "grey",
                opacity: 0.5,
              }}
            />
            <FlexCol flexGrow={1}>
              {selectedIdeaChange && (
                <IdeaChangeDialogDetailsRight ideaChange={selectedIdeaChange} />
              )}
            </FlexCol>
          </Flex>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default IdeaChangesDialog
