import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons";
import Flex from "@/components/_common/flexboxes/Flex";
import FlexCenter from "@/components/_common/flexboxes/FlexCenter";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import MyTextField from "@/components/_common/inputs/MyTextField";
import useDeleteLabelMutation from "@/hooks/react-query/domain/label/useDeleteLabelMutation";
import useSaveLabelMutation from "@/hooks/react-query/domain/label/useSaveLabelMutation";
import useConfirmDialogStore from "@/hooks/zustand/dialogs/useConfirmDialogStore";
import useEditLabelDialogStore from "@/hooks/zustand/dialogs/useEditLabelDialogStore";
import LabelDto from "@/types/domain/label/LabelDto";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdCheck, MdClose, MdDelete } from "react-icons/md";
import labelColors from "./labelColors";

const ariaLabel = "edit-label-dialog";

const EditLabelDialog = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLDivElement>(null);

  const saveTabMutation = useSaveLabelMutation();
  const isLoading = saveTabMutation.isLoading;

  const { mutate: deleteLabelMutation } = useDeleteLabelMutation();
  const { openConfirmDialog } = useConfirmDialogStore();

  const { initialValue, dialogIsOpen, closeDialog } = useEditLabelDialogStore();

  const { watch, control, handleSubmit, reset, setValue } = useForm<LabelDto>({
    defaultValues: initialValue,
  });

  useEffect(() => {
    if (dialogIsOpen) {
      reset(initialValue);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [dialogIsOpen]);

  const onSubmit = (values: LabelDto) => {
    console.log(values);
    saveTabMutation.mutate(values, {
      onSuccess: (saved) => {
        closeDialog();
      },
    });
  };

  const handleDelete = (id: string) => {
    openConfirmDialog({
      title: "Delete this label?",
      onConfirm: () => {
        deleteLabelMutation(id, {
          onSuccess: closeDialog,
        });
      },
    });
  };

  return (
    <Dialog
      open={dialogIsOpen}
      onClose={closeDialog}
      fullWidth
      maxWidth="xs"
      aria-labelledby={ariaLabel}
    >
      <Box pb={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id={`${ariaLabel}-title`}>
            <FlexVCenter justifyContent="space-between">
              <Typography variant="h5">
                {watch("id") ? "Edit Label" : "New Label"}
              </Typography>

              <IconButton onClick={closeDialog}>
                <MdClose />
              </IconButton>
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <MyTextField
                  id="name"
                  size="small"
                  label="Label name"
                  fullWidth
                  required
                  autoFocus
                  sx={{ mt: 1 }}
                  {...field}
                  inputRef={inputRef}
                />
              )}
            />

            <FlexCol mt={2} gap={1}>
              <Typography>Select a color: </Typography>
              <Flex flexWrap="wrap" gap={1}>
                {labelColors.map((color) => (
                  <FlexCenter
                    key={color}
                    sx={{
                      width: 40,
                      height: 32,
                      borderRadius: "4px",
                      background: color,
                      cursor: "pointer",
                    }}
                    onClick={() => setValue("bgColor", color)}
                  >
                    {watch("bgColor") === color && <MdCheck />}
                  </FlexCenter>
                ))}
              </Flex>
            </FlexCol>
          </DialogContent>

          <DialogTitle>
            <FlexVCenter justifyContent={"space-between"}>
              <SaveCancelButtons disabled={isLoading} onCancel={closeDialog} />
              {watch("id") && (
                <Button
                  startIcon={<MdDelete />}
                  color="error"
                  variant="contained"
                  onClick={() => handleDelete(watch("id"))}
                >
                  Delete
                </Button>
              )}
            </FlexVCenter>
          </DialogTitle>
        </form>
      </Box>
    </Dialog>
  );
};

export default EditLabelDialog;
