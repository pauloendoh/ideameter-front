import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton";
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import { HighImpactVoteDto } from "@/types/domain/high-impact-votes/HighImpactVoteDto";
import { pushOrRemove } from "@/utils/array/pushOrRemove";
import { useTheme } from "@mui/material";
import { useMemo } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { MdOfflineBolt } from "react-icons/md";

interface Props {
  watch: UseFormWatch<IdeaDto>;
  setValue: UseFormSetValue<IdeaDto>;
}

const HighImpactVoteButton = ({ watch, setValue }: Props) => {
  const { authUser } = useAuthStore();

  const theme = useTheme();

  const toggleUserVote = () => {
    const vote: HighImpactVoteDto = {
      ideaId: watch("id"),
      userId: authUser!.id,
    };

    const currVotes = watch("highImpactVotes");
    const newVotes = pushOrRemove(currVotes, vote, "userId");

    setValue("highImpactVotes", newVotes);
  };

  const youAlreadyVoted = useMemo(() => {
    const currVotes = watch("highImpactVotes");
    return Boolean(currVotes?.find((v) => v.userId === authUser!.id));
  }, [watch("highImpactVotes")]);

  const buttonBgColor = useMemo(() => {
    return youAlreadyVoted ? theme.palette.secondary.main : undefined;
  }, [youAlreadyVoted]);

  return (
    <DarkButton
      startIcon={<MdOfflineBolt />}
      sx={{
        justifyContent: "flex-start",
        pl: 2,
        backgroundColor: buttonBgColor,
        ":hover": {
          background: buttonBgColor,
        },
      }}
      onClick={toggleUserVote}
    >
      {youAlreadyVoted ? "You voted as high impact" : "Vote as high impact"}
    </DarkButton>
  );
};

export default HighImpactVoteButton;
