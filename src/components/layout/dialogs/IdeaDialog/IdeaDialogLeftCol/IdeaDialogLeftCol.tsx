import FlexCol from "@/components/_common/flexboxes/FlexCol";
import MyTextField from "@/components/_common/inputs/MyTextField";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { Grid } from "@mui/material";
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import IdeaDialogAssignedUsers from "../IdeaDialogAssignedUsers/IdeaDialogAssignedUsers";
import IdeaDialogSelectedLabels from "../IdeaDialogSelectedLabels/IdeaDialogSelectedLabels";
import IdeaDialogUsersVotedHighImpact from "../IdeaDialogUsersVotedHighImpact/IdeaDialogUsersVotedHighImpact";

interface Props {
  watch: UseFormWatch<IdeaDto>;
  setValue: UseFormSetValue<IdeaDto>;
  control: Control<IdeaDto>;
  onSubmit: (idea: IdeaDto) => void;
}

const IdeaDialogLeftCol = ({ watch, setValue, control, onSubmit }: Props) => {
  return (
    <Grid item xs={8}>
      <FlexCol sx={{ gap: 4 }}>
        <Grid container>
          <Grid item xs={6}>
            <IdeaDialogAssignedUsers watch={watch} setValue={setValue} />
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
  );
};

export default IdeaDialogLeftCol;
