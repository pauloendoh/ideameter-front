import Txt from "@/components/_common/text/Txt";
import useConfirmDialogStore from "@/hooks/zustand/dialogs/useConfirmDialogStore";
import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import S from "./ConfirmDialog.styles";

const ConfirmDialog = () => {
  const {
    confirmDialogIsOpen,
    closeConfirmDialog,
    confirmDialogValue: val,
  } = useConfirmDialogStore();

  const confirmAndClose = () => {
    closeConfirmDialog();
    val.onConfirm();
  };

  return (
    <Dialog
      onClose={closeConfirmDialog}
      open={confirmDialogIsOpen}
      fullWidth
      maxWidth="xs"
      aria-labelledby="confirm-dialog"
      PaperProps={{
        sx: {
          position: "absolute",
          top: 75,
        },
      }}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          confirmAndClose();
        }
      }}
    >
      <Box pb={1} px={1}>
        <DialogTitle id="confirm-dialog-title">
          <Txt variant="h5">{val.title}</Txt>
        </DialogTitle>
        {val?.description && val?.description.length > 0 && (
          <DialogContent>
            <Txt>{val.description}</Txt>
          </DialogContent>
        )}

        <DialogTitle>
          <S.ButtonsWrapper>
            <Button
              id="confirm-button"
              variant="contained"
              color="primary"
              size="small"
              onClick={confirmAndClose}
            >
              {val?.confirmText && val.confirmText.length > 0
                ? val.confirmText
                : "Yes"}
            </Button>
            <Button size="small" onClick={closeConfirmDialog}>
              Cancel
            </Button>
          </S.ButtonsWrapper>
        </DialogTitle>
      </Box>
    </Dialog>
  );
};

export default ConfirmDialog;
