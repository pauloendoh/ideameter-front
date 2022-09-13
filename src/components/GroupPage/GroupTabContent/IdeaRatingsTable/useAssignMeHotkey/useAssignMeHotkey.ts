import useSaveIdeaMutation from "@/hooks/react-query/domain/group/tab/idea/useSaveIdeaMutation";
import { useRouterQueryString } from "@/hooks/utils/useRouterQueryString";
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import useIdeaHoverStore from "@/hooks/zustand/domain/idea/useIdeaHoverStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import SimpleUserDto from "@/types/domain/user/SimpleUserDto";
import { pushOrRemove } from "@/utils/array/pushOrRemove";
import queryKeys from "@/utils/queryKeys";
import { useHotkeys } from "react-hotkeys-hook";
import { useQueryClient } from "react-query";

export const useAssignMeHotkey = () => {
  const hoveredIdeaId = useIdeaHoverStore((s) => s.hoveredIdeaId);
  const { mutate: submitSaveIdea } = useSaveIdeaMutation();

  const { groupId } = useRouterQueryString();
  const queryClient = useQueryClient();
  const authUser = useAuthStore((s) => s.authUser);

  return useHotkeys(
    "a",
    () => {
      if (hoveredIdeaId && groupId) {
        const groupIdeas = queryClient.getQueryData<IdeaDto[]>(
          queryKeys.groupIdeas(groupId)
        );
        if (!groupIdeas) return;
        const idea = groupIdeas.find((i) => i.id === hoveredIdeaId);
        if (!idea) return;

        const user: SimpleUserDto = {
          id: authUser!.id,
          email: authUser!.email,
          username: authUser!.username,
        };
        idea.assignedUsers = pushOrRemove(idea.assignedUsers, user, "id");
        submitSaveIdea(idea);
      }
    },
    [hoveredIdeaId, groupId]
  );
};
