import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import useTabIdeasQuery from "@/hooks/react-query/domain/group/tab/idea/useTabIdeasQuery";
import useIdeaRatingsQueryUtils from "@/hooks/react-query/domain/group/useIdeaRatingsQueryUtils";
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore";
import { newIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import IdeaRatingsTable from "./IdeaRatingsTable/IdeaRatingsTable";

interface Props {
  tabId: string;
  groupId: string;
}

const GroupTabContent = (props: Props) => {
  const query = useRouter().query as { groupId: string };
  const { data: ideas } = useTabIdeasQuery({
    tabId: props.tabId,
    groupId: props.groupId,
  });

  const ideaRatings = useIdeaRatingsQueryUtils(query.groupId, props.tabId);

  const { openDialog } = useIdeaDialogStore();

  return (
    <FlexCol gap={2}>
      <Box>{ideas && <IdeaRatingsTable ideaRatings={ideaRatings} />}</Box>
      <FlexVCenter ml={2} mb={1}>
        <DarkButton
          onClick={() => openDialog(newIdeaDto({ tabId: props.tabId }))}
        >
          + New idea
        </DarkButton>
      </FlexVCenter>
    </FlexCol>
  );
};

export default GroupTabContent;
