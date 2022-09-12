import Flex from "@/components/_common/flexboxes/Flex";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import ProfilePicture from "@/components/_common/ProfilePicture/ProfilePicture";
import useSaveSubideaMutation from "@/hooks/react-query/domain/subidea/useSaveSubideaMutation";
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import useEditProfileDialogStore from "@/hooks/zustand/dialogs/useEditProfileDialogStore";
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import useSnackbarStore from "@/hooks/zustand/useSnackbarStore";
import AuthUserGetDto from "@/types/domain/auth/AuthUserGetDto";
import myAxios from "@/utils/axios/myAxios";
import queryKeys from "@/utils/queryKeys";
import urls from "@/utils/urls";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent, createRef, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { MdClose, MdPhotoCamera } from "react-icons/md";
import { useQueryClient } from "react-query";

const ariaLabel = "edit-profile-dialog";

const EditProfileDialog = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  const query = useRouter().query as { groupId: string };

  const saveMutation = useSaveSubideaMutation();
  const [authUser, setAuthUser] = useAuthStore((s) => [
    s.authUser,
    s.setAuthUser,
  ]);

  const {
    initialValue,
    dialogIsOpen,
    closeDialog,
  } = useEditProfileDialogStore();

  const { groupId } = useRouterQueryString();
  const queryClient = useQueryClient();

  const [setSuccessMessage, setErrorMessage] = useSnackbarStore((s) => [
    s.setSuccessMessage,
    s.setErrorMessage,
  ]);

  const { watch, control, setValue, handleSubmit, reset } = useForm<
    AuthUserGetDto
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

  const fileInput = createRef<HTMLInputElement>();

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    console.log(file);
    myAxios
      .put<AuthUserGetDto>(urls.api.profilesPicture, formData)
      .then((res) => {
        setSuccessMessage("Image uploaded!");

        // ignore token and expiration

        setValue("profile.pictureUrl", res.data.profile!.pictureUrl);
        // editProfilePicture(res.data);

        if (authUser)
          setAuthUser({
            ...authUser,
            profile: res.data.profile,
          });

        if (groupId)
          queryClient.invalidateQueries(queryKeys.groupMembers(groupId));
      })
      .catch((err) => {
        setErrorMessage(
          "Profile picture error: invalid type or image is too heavy (2MB max)"
        );
      });
  };

  const onSubmit = (values: AuthUserGetDto) => {
    // saveMutation.mutate(
    //   { subidea: values, groupId: query.groupId },
    //   {
    //     onSuccess: (savedTab) => {
    //       closeDialog();
    //     },
    //   }
    // );
  };

  return (
    <Dialog
      open={dialogIsOpen}
      onClose={closeDialog}
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
              <Typography variant="h5">Edit profile</Typography>

              <FlexVCenter>
                <IconButton onClick={closeDialog}>
                  <MdClose />
                </IconButton>
              </FlexVCenter>
            </FlexVCenter>
          </DialogTitle>

          <DialogContent>
            <Flex pt={1} sx={{ gap: 2 }}>
              <Box>
                <Box
                  position="relative"
                  onClick={() => {
                    if (fileInput?.current) {
                      fileInput.current.click();
                    }
                  }}
                >
                  <ProfilePicture
                    pictureUrl={watch("profile.pictureUrl")}
                    username={watch("username")}
                    size={120}
                    onClick={() => {}}
                  />
                  <MdPhotoCamera
                    size={24}
                    style={{
                      position: "absolute",
                      left: 48,
                      bottom: 48,
                      cursor: "pointer",
                    }}
                  />
                </Box>
                <Box>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    onChange={handleFileSelection}
                    ref={fileInput}
                  />
                </Box>
              </Box>
              {/* <Controller
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
              /> */}
            </Flex>
          </DialogContent>

          <DialogTitle>
            {/* <SaveCancelButtons
              disabled={saveMutation.isLoading}
              onCancel={closeDialog}
            /> */}
          </DialogTitle>
        </form>
      </Box>
    </Dialog>
  );
};

export default EditProfileDialog;
