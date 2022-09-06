import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton";
import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons";
import Flex from "@/components/_common/flexboxes/Flex";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import MyTextField from "@/components/_common/inputs/MyTextField";
import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation";
import useIdeaAssignmentStore from "@/hooks/zustand/dialogs/useIdeaAssignmentStore";
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore";
import useSubideaDialogStore from "@/hooks/zustand/dialogs/useSubideaDialogStore";
import IdeaDto, { newIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto";
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdClose, MdOutlineAdd } from "react-icons/md";
import IdeaDialogRightCol from "./IdeaDialogRightCol/IdeaDialogRightCol";
import IdeaDialogSelectedLabels from "./IdeaDialogSelectedLabels/IdeaDialogSelectedLabels";
import IdeaMenu from "./IdeaMenu/IdeaMenu";
import SubideasTable from "./SubideasTable/SubideasTable";

const ariaLabel = "idea-dialog";

const IdeaDialog = () => {
  const inputRef = useRef<HTMLDivElement>(null);

  const saveIdeaMutation = useSaveIdeaMutation();

  const { initialValue, dialogIsOpen, closeDialog } = useIdeaDialogStore();

  const openAssignDialog = useIdeaAssignmentStore((s) => s.openDialog);

  const openSubideaDialog = useSubideaDialogStore((s) => s.openDialog);

  const { watch, control, setValue, register, handleSubmit, reset } = useForm<
    IdeaDto
  >({
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
      maxWidth="xl"
      aria-labelledby={ariaLabel}
    >
      <Box pb={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id={`${ariaLabel}-title`}>
            <FlexVCenter justifyContent="space-between">
              <Typography variant="h5">
                {watch("id") ? "Edit Idea" : "New Idea"}
              </Typography>

              <FlexVCenter>
                <IdeaMenu idea={watch()} afterDelete={closeDialog} />
                <IconButton onClick={closeDialog}>
                  <MdClose />
                </IconButton>
              </FlexVCenter>
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <Grid container pt={1} spacing={2}>
              <Grid item xs={8}>
                <FlexCol sx={{ gap: 2 }}>
                  {watch("assignedUsers")?.length > 0 && (
                    <Flex gap={1}>
                      {watch("assignedUsers").map((user) => (
                        <Avatar key={user.id}>
                          {user.username[0].toUpperCase()}
                        </Avatar>
                      ))}
                      <Avatar
                        sx={{ cursor: "pointer", background: "LightGray" }}
                        onClick={() =>
                          openAssignDialog(
                            watch("assignedUsers"),
                            (newValues) => setValue("assignedUsers", newValues)
                          )
                        }
                      >
                        <MdOutlineAdd />
                      </Avatar>
                    </Flex>
                  )}

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
              </Grid>

              <IdeaDialogRightCol watch={watch} setValue={setValue} />
            </Grid>

            {watch("id") && (
              <FlexCol mt={2}>
                <DarkButton
                  sx={{ width: 150 }}
                  onClick={() => {
                    openSubideaDialog(newIdeaDto({ parentId: watch("id") }));
                  }}
                >
                  Create subideas
                </DarkButton>

                <SubideasTable parentId={watch("id")} />
              </FlexCol>
            )}
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
