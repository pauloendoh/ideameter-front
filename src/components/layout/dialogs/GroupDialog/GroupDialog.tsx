import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import MyTextField from "@/components/_common/inputs/MyTextField";
import useSaveGroupMutation from "@/hooks/react-query/domain/group/useSaveGroupMutation";
import useGroupDialogStore from "@/hooks/zustand/dialogs/useGroupDialogStore";
import GroupDto from "@/types/domain/group/GroupDto";
import urls from "@/utils/urls";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import GroupMembers from "./GroupMembers/GroupMembers";
import GroupMoreIcon from "./GroupMoreIcon/GroupMoreIcon";

const GroupDialog = () => {
  const router = useRouter();
  const { initialValue, isOpen, close } = useGroupDialogStore();
  const inputRef = useRef<HTMLDivElement>(null);
  const { mutate } = useSaveGroupMutation();

  const { register, control, handleSubmit, reset, watch, setValue } = useForm<
    GroupDto
  >({
    defaultValues: initialValue,
  });

  const onSubmit = (values: GroupDto) => {
    mutate(values, {
      onSuccess: (savedGroup) => {
        close();
        router.push(urls.pages.groupId(String(savedGroup.id)));
      },
    });
  };

  useEffect(() => {
    if (isOpen) {
      reset(initialValue);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <Dialog
      onClose={close}
      open={isOpen}
      fullWidth
      maxWidth="xs"
      aria-labelledby="group-dialog"
    >
      <Box pb={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="group-dialog-title">
            <FlexVCenter justifyContent="space-between">
              <Typography variant="h5">
                {watch("id") ? "Edit Group" : "New Group"}
              </Typography>

              <GroupMoreIcon group={watch()} onAfterDelete={close} />
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <FlexCol pt={1} sx={{ gap: 2 }}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <MyTextField
                    size="small"
                    label="Group name"
                    fullWidth
                    required
                    {...field}
                    inputRef={inputRef}
                  />
                )}
              />

              <MyTextField
                id="description"
                size="small"
                label="Description"
                fullWidth
                {...register("description")}
              />
            </FlexCol>
          </DialogContent>

          <DialogTitle>
            <SaveCancelButtons
              // disabled={isSubmitting}
              onCancel={close}
            />
          </DialogTitle>
        </form>

        {initialValue.id && <GroupMembers groupId={initialValue.id} />}
      </Box>
    </Dialog>
  );
};

export default GroupDialog;
