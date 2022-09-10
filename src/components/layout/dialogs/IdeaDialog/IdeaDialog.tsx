import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton";
import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import MyTextField from "@/components/_common/inputs/MyTextField";
import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation";
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore";
import useSubideaDialogStore from "@/hooks/zustand/dialogs/useSubideaDialogStore";
import IdeaDto, { newIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import IdeaDialogAssignedUsers from "./IdeaDialogAssignedUsers/IdeaDialogAssignedUsers";
import IdeaDialogRightCol from "./IdeaDialogRightCol/IdeaDialogRightCol";
import IdeaDialogSelectedLabels from "./IdeaDialogSelectedLabels/IdeaDialogSelectedLabels";
import IdeaDialogUsersVotedHighImpact from "./IdeaDialogUsersVotedHighImpact/IdeaDialogUsersVotedHighImpact";
import IdeaMenu from "./IdeaMenu/IdeaMenu";
import SubideasTable from "./SubideasTable/SubideasTable";

const ariaLabel = "idea-dialog";

const IdeaDialog = () => {
  const inputRef = useRef<HTMLDivElement>(null);

  const saveIdeaMutation = useSaveIdeaMutation();

  const { initialValue, dialogIsOpen, closeDialog } = useIdeaDialogStore();

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
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <MyTextField
                    size="small"
                    fullWidth
                    multiline
                    placeholder="Idea Title"
                    variant="standard"
                    onCtrlEnter={() => onSubmit(watch())}
                    required
                    sx={{
                      background: "transparent",
                    }}
                    InputProps={{
                      sx: {
                        fontSize: 24,
                      },
                    }}
                    {...field}
                    inputRef={inputRef}
                  />
                )}
              />

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
                <FlexCol sx={{ gap: 4 }}>
                  <Grid container>
                    <Grid item xs={6}>
                      <IdeaDialogAssignedUsers
                        watch={watch}
                        setValue={setValue}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {watch("highImpactVotes")?.length > 0 && (
                        <IdeaDialogUsersVotedHighImpact
                          watch={watch}
                          setValue={setValue}
                        />
                      )}
                    </Grid>
                  </Grid>

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
