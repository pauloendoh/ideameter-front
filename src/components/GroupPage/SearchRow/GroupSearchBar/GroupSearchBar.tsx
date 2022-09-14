import MyTextField from "@/components/_common/inputs/MyTextField";
import useGroupIdeasQuery from "@/hooks/react-query/domain/group/idea/useGroupIdeasQuery";
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { Autocomplete, Box, Popper } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  test?: string;
}

const GroupSearchBar = (props: Props) => {
  const router = useRouter();
  const { groupId } = router.query as { groupId: string };
  const { data, refetch } = useGroupIdeasQuery(groupId);

  const openIdeaDialog = useIdeaDialogStore((s) => s.openDialog);
  const dialogIsOpen = useIdeaDialogStore((s) => s.dialogIsOpen);

  const [value, setValue] = useState<IdeaDto | null>(null);

  const MyPopper = function (props: React.ComponentProps<typeof Popper>) {
    return (
      <Popper
        {...props}
        sx={{ width: 700, display: dialogIsOpen ? "none" : "unset" }}
        placement="bottom-start"
      />
    );
  };

  useEffect(() => {
    if (!value) return;
    openIdeaDialog(value);

    setValue(null);
  }, [value]);

  return (
    <Box onClick={() => refetch()}>
      <Autocomplete
        value={value}
        onChange={(e, idea) => {
          setValue(idea);
        }}
        PopperComponent={MyPopper}
        options={data || []}
        renderInput={(params) => (
          <MyTextField
            {...params}
            label="Search ideas"
            size="small"
            sx={{ width: 200 }}
          />
        )}
        getOptionLabel={(option) => option.name}
      />
    </Box>
  );
};

export default GroupSearchBar;
