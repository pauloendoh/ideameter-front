import UserGroupAvatar from "@/components/GroupPage/GroupTabContent/IdeaRatingsTable/UserTableCell/UserGroupAvatar/UserGroupAvatar";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import Txt from "@/components/_common/text/Txt";
import useGroupMembersQuery from "@/hooks/react-query/domain/group-members/useGroupMembersQuery";
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import useIdeaAssignmentStore from "@/hooks/zustand/dialogs/useIdeaAssignmentStore";
import SimpleUserDto from "@/types/domain/user/SimpleUserDto";
import { pushOrRemove } from "@/utils/array/pushOrRemove";
import pushOrReplace from "@/utils/array/pushOrReplace";
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import produce from "immer";
import { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

const ariaLabel = "idea-assign-dialog";

const IdeaAssignDialog = () => {
  const routerQuery = useRouterQueryString();

  const inputRef = useRef<HTMLDivElement>(null);

  const { data: members } = useGroupMembersQuery(routerQuery.groupId!);

  const {
    initialValues,
    onChange,
    dialogIsOpen,
    closeDialog,
  } = useIdeaAssignmentStore();

  const [localValues, setLocalValues] = useState<SimpleUserDto[]>([]);

  useEffect(() => {
    if (initialValues) setLocalValues(initialValues);
  }, [initialValues]);

  // useEffect(() => {
  //   if (props.open) {
  //     reset(props.initialValue);
  //     setTimeout(() => {
  //       inputRef.current?.focus();
  //     }, 100);
  //   }
  // }, [props.open]);

  // const onSubmit = (values: IdeaDto) => {
  //   saveMutation.mutate(
  //     { subidea: values, groupId: query.groupId },
  //     {
  //       onSuccess: (savedTab) => {
  //         props.onClose();
  //       },
  //     }
  //   );
  // };

  const idIsChecked = (userId: string) => {
    return Boolean(localValues.find((v) => v.id === userId));
  };

  const handleChange = (user: SimpleUserDto, checked: boolean) => {
    const newValue = produce(localValues, (draft) => {
      if (checked) {
        return pushOrReplace(draft, user, "id");
      }
      return pushOrRemove(draft, user, "id");
    });

    setLocalValues(newValue);
    onChange(newValue);
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
        <DialogTitle id={`${ariaLabel}-title`}>
          <FlexVCenter justifyContent="space-between">
            <Typography variant="h5">Assign Idea</Typography>

            <IconButton onClick={closeDialog}>
              <MdClose />
            </IconButton>
          </FlexVCenter>
        </DialogTitle>

        <DialogContent>
          <FlexCol pt={1}>
            {members?.map((member) => (
              <FormControlLabel
                key={member.userId}
                label={
                  <FlexVCenter gap={1}>
                    <UserGroupAvatar
                      userId={member.user.id}
                      groupId={routerQuery.groupId!}
                      avatarProps={{
                        sx: { width: 24, height: 24, fontSize: 14 },
                      }}
                    />

                    <Txt>{member.user.username}</Txt>
                  </FlexVCenter>
                }
                control={
                  <Checkbox
                    checked={idIsChecked(member.user.id)}
                    onChange={(e) =>
                      handleChange(member.user, e.currentTarget.checked)
                    }
                  />
                }
              />
            ))}
          </FlexCol>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default IdeaAssignDialog;
