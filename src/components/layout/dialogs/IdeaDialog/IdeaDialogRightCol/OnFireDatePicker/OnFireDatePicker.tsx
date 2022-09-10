import MyTextField from "@/components/_common/inputs/MyTextField";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { getOnFireSinceFormat } from "@/utils/domain/idea/getOnFireSinceFormat";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface Props {
  watch: UseFormWatch<IdeaDto>;
  setValue: UseFormSetValue<IdeaDto>;
}

const OnFireDatePicker = ({ watch, setValue }: Props) => {
  const handleChange = () => {};

  const getInputFormat = () => {
    const onFireSince = watch("onFireSince");

    return getOnFireSinceFormat(onFireSince);
  };

  const disableMaskedInput = useMemo(() => {
    const onFireSince = watch("onFireSince");

    if (isNaN(Date.parse(onFireSince || ""))) return true;

    return false;
  }, [watch("onFireSince")]);

  return (
    <>
      <DesktopDatePicker
        label="On fire since"
        disableMaskedInput={disableMaskedInput}
        inputFormat={getInputFormat()}
        value={
          watch("onFireSince") ? DateTime.fromISO(watch("onFireSince")!) : null
        }
        onChange={(value) => {
          if (value) return setValue("onFireSince", value.toISO());

          return setValue("onFireSince", null);
        }}
        renderInput={(params) => <MyTextField {...params} />}
      />
    </>
  );
};

export default OnFireDatePicker;
