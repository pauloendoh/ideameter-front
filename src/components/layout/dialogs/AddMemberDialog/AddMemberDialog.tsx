import SaveCancelButtons from "@/components/_common/buttons/SaveCancelButtons/SaveCancelButtons";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import MyTextField from "@/components/_common/inputs/MyTextField";
import useAddMemberMutation from "@/hooks/react-query/domain/group-members/useAddMemberMutation";
import useSearchUsersQuery from "@/hooks/react-query/domain/user/useSearchUsersQuery";
import useDebounce from "@/hooks/utils/useDebounce";
import UserSearchResultDto from "@/types/domain/user/UserSearchResultDto";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { MdClose } from "react-icons/md";

interface Props {
  open: boolean;
  onClose: () => void;

  groupId: string;
  currentMemberIds: string[];
}

const AddMemberDialog = (props: Props) => {
  const MIN_LENGTH = 3;

  const [searchQuery, setSearchQuery] = useState("");
  const [value, setValue] = useState<UserSearchResultDto | null>(null);

  const addMemberMutation = useAddMemberMutation();
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const {
    data: userResults,
    refetch,
    isFetching,
  } = useSearchUsersQuery(debouncedSearchQuery, MIN_LENGTH);

  useEffect(() => {
    if (searchQuery === debouncedSearchQuery) refetch();
  }, [searchQuery, debouncedSearchQuery]);

  const options = useMemo(() => {
    if (!userResults) return [];

    // filter out current members
    return userResults.filter(
      (user) => !props.currentMemberIds.includes(user.id)
    );
  }, [userResults, props.currentMemberIds]);

  const onSubmit = () => {
    if (!value) return;
    addMemberMutation.mutate(
      { groupId: props.groupId, memberId: value.id },
      {
        onSuccess: props.onClose,
      }
    );
  };

  return (
    <Dialog
      onClose={() => props.onClose()}
      open={props.open}
      fullWidth
      maxWidth="xs"
      aria-labelledby="add-member-dialog"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <DialogTitle id="add-member-dialog-title">
          <FlexVCenter justifyContent="space-between">
            <Typography variant="h5">Add Member</Typography>

            <IconButton>
              <MdClose onClick={() => props.onClose()} />
            </IconButton>
          </FlexVCenter>
        </DialogTitle>

        <DialogContent>
          <Autocomplete
            sx={{ pt: 1 }}
            loading={isFetching}
            freeSolo={searchQuery.length < MIN_LENGTH}
            noOptionsText={"No users found :("}
            options={options}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.username
            }
            value={value}
            onChange={(e, newValue) => {
              if (typeof newValue === "string") return;
              setValue(newValue);
            }}
            filterOptions={(x) => x}
            renderInput={(params) => (
              <MyTextField
                {...params}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                label="Search users"
                size="small"
                fullWidth
              />
            )}
          />
        </DialogContent>

        <DialogTitle>
          <SaveCancelButtons disabled={!value} onCancel={props.onClose} />
        </DialogTitle>
      </form>
    </Dialog>
  );
};

export default AddMemberDialog;
