import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import MyTextField from "@/components/_common/inputs/MyTextField";
import useSaveSubideaMutation from "@/hooks/react-query/domain/subidea/useSaveSubideaMutation";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";

const ariaLabel = "subidea-dialog";

interface Props {
  initialValue: IdeaDto;
  open: boolean;
  onClose: () => void;
}

const SubideaDialog = (props: Props) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const query = useRouter().query as { groupId: string };

  const saveMutation = useSaveSubideaMutation();

  const { watch, control, setValue, handleSubmit, reset } = useForm<IdeaDto>({
    defaultValues: props.initialValue,
  });

  useEffect(() => {
    if (props.open) {
      reset(props.initialValue);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [props.open]);

  const onSubmit = (values: IdeaDto) => {
    saveMutation.mutate(
      { subidea: values, groupId: query.groupId },
      {
        onSuccess: (savedTab) => {
          props.onClose();
        },
      }
    );
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullWidth
      aria-labelledby={ariaLabel}
      PaperProps={{
        sx: {
          maxWidth: 360,
        },
      }}
    >
      <Box pb={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id={`${ariaLabel}-title`}>
            <FlexVCenter justifyContent="space-between">
              <Typography variant="h5">
                {watch("id") ? "Edit Subidea" : "New Subidea"}
              </Typography>

              <IconButton onClick={props.onClose}>
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
                    label="Subidea"
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
              disabled={saveMutation.isLoading}
              onCancel={props.onClose}
            />
          </DialogTitle>
        </form>
      </Box>
    </Dialog>
  );
};

export default SubideaDialog;
