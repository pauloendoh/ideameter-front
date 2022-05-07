import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import MyTextField from "@/components/_common/inputs/MyTextField";
import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation";
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import IdeaDialogSelectedLabels from "./IdeaDialogSelectedLabels/IdeaDialogSelectedLabels";

const ariaLabel = "idea-dialog";

const IdeaDialog = () => {
  const inputRef = useRef<HTMLDivElement>(null);

  const saveIdeaMutation = useSaveIdeaMutation();
  const { initialValue, dialogIsOpen, closeDialog } = useIdeaDialogStore();

  const { watch, control, setValue, register, handleSubmit, reset } =
    useForm<IdeaDto>({
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

  const onSubmit = (values: IdeaDto) => {
    saveIdeaMutation.mutate(values, {
      onSuccess: (savedTab) => {
        closeDialog();
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
                {watch("id") ? "Edit Idea" : "New Idea"}
              </Typography>

              <IconButton onClick={closeDialog}>
                <MdClose />
              </IconButton>
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <FlexCol pt={1} sx={{ gap: 2 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <MyTextField
                    size="small"
                    label="Idea"
                    fullWidth
                    multiline
                    minRows={2}
                    onCtrlEnter={() => onSubmit(watch())}
                    required
                    {...field}
                    inputRef={inputRef}
                  />
                )}
              />

              <IdeaDialogSelectedLabels
                idea={watch()}
                onChangeSelectedLabels={(labels) => {
                  setValue("labels", labels);
                }}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MyTextField
                    id="description"
                    size="small"
                    label="Description"
                    multiline
                    minRows={3}
                    onCtrlEnter={() => onSubmit(watch())}
                    {...field}
                    fullWidth
                  />
                )}
              />
            </FlexCol>
          </DialogContent>

          <DialogTitle>
            <SaveCancelButtons
              // disabled={isSubmitting}
              onCancel={closeDialog}
            />
          </DialogTitle>
        </form>
      </Box>
    </Dialog>
  );
};

export default IdeaDialog;
