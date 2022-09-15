import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import upsert from "@/utils/array/upsert";
import queryKeys from "@/utils/queryKeys";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useSocketEvent } from "socket.io-react-hook";
import { useMySocketEvent } from "../../useMySocketEvent";
import { useGroupSocket } from "./useGroupSocket";

export const useGroupRelatedSockets = (groupId: string | undefined) => {
  const { socket } = useGroupSocket(groupId);
  const { sendMessage: sendEnterGroupMessage } = useSocketEvent<string>(
    socket,
    "enter-group"
  );

  useEffect(() => {
    console.log({ groupId, sendEnterGroupMessage });
    if (groupId) sendEnterGroupMessage(groupId);
  }, [groupId]);

  const { lastMessage } = useMySocketEvent<{ idea: IdeaDto; groupId: string }>(
    "saveIdea"
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (lastMessage && groupId) {
      queryClient.setQueryData<IdeaDto[]>(
        queryKeys.groupIdeas(groupId),
        (curr) => upsert(curr, lastMessage.idea, (i) => i.id === groupId)
      );
    }
  }, [lastMessage]);
};
