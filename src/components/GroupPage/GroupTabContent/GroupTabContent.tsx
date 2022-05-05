import DarkButton from "@/components/_common/buttons/DarkButton/DarkButton";
import FlexCol from "@/components/_common/flexboxes/FlexCol";
import FlexVCenter from "@/components/_common/flexboxes/FlexVCenter";
import useTabIdeasQuery from "@/hooks/react-query/domain/group/tab/idea/useTabIdeasQuery";
import useIdeaDialogStore from "@/hooks/zustand/dialogs/useIdeaDialogStore";
import { newIdeaDto } from "@/types/domain/group/tab/idea/IdeaDto";
import { Box } from "@mui/material";
import React from "react";
import IdeaTable from "./IdeaTable/IdeaTable";

interface Props {
  tabId: string;
}

const GroupTabContent = (props: Props) => {
  const { data: ideas } = useTabIdeasQuery(props.tabId);

  const { openDialog } = useIdeaDialogStore();
  return (
    <FlexCol gap={2}>
      <Box>{ideas && <IdeaTable ideas={ideas} />}</Box>
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
