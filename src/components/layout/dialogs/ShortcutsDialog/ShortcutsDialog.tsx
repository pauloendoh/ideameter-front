import Flex from "@/components/_common/flexboxes/Flex"
import FlexCol from "@/components/_common/flexboxes/FlexCol"
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter"
import Txt from "@/components/_common/text/Txt"
import useShortcutsDialogStore from "@/hooks/zustand/dialogs/useShortcutsDialogStore"
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material"
import { MdClose } from "react-icons/md"
import { shortcutSections } from "./ShortcutsDialog.utils"

const ariaLabel = "shortcuts-dialog"

const ShortcutsDialog = () => {
  const { openDialog, closeDialog, dialogIsOpen } = useShortcutsDialogStore()

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
            <Typography variant="h5">Keyboard shortcuts</Typography>

            <IconButton onClick={closeDialog}>
              <MdClose />
            </IconButton>
          </FlexVCenter>
        </DialogTitle>

        <DialogContent>
          <FlexCol style={{ gap: 24 }}>
            {shortcutSections.map((section) => (
              <Box key={section.title}>
                <Txt variant="h6" style={{ fontWeight: "bold" }}>
                  {section.title}
                </Txt>
                <FlexCol mt={1} style={{ gap: 8 }}>
                  {section.shortcuts.map((shortcut) => (
                    <Flex key={shortcut.name} justifyContent="space-between">
                      <Txt>{shortcut.name}</Txt>
                      <Box
                        style={{
                          background: "rgb(23, 22, 22)",
                          borderRadius: 4,
                          padding: "4px 8px",
                        }}
                      >
                        {shortcut.shortcut}
                      </Box>
                    </Flex>
                  ))}
                </FlexCol>
              </Box>
            ))}
          </FlexCol>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default ShortcutsDialog
