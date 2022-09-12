import useGroupFilterStore from "@/hooks/zustand/domain/auth/group/useGroupFilterStore";
import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import UserGroupDto from "@/types/domain/group/UserGroupDto";
import { useCallback, useMemo } from "react";
import useOtherMembersQueryUtils from "../group-members/useOtherMembersQueryUtils";
import useSubideasQuery from "../subidea/useSubideasQuery";
import useGroupIdeasQuery from "./idea/useGroupIdeasQuery";
import useRatingsQuery from "./tab/idea/rating/useRatingsQuery";

export interface OtherUserGroupRating {
  userGroup: UserGroupDto;
  rating: number | null;
}
export interface IdeaRating {
  idea: IdeaDto;
  subideas: IdeaDto[];
  avgRating: number | null;
  yourRating: number | null;
  otherUserGroupRatings: OtherUserGroupRating[];
}

const useIdeaRatingsQueryUtils = (groupId: string, tabId: string) => {
  const { authUser } = useAuthStore();
  const { data: subideas } = useSubideasQuery(groupId);
  const otherMembers = useOtherMembersQueryUtils(groupId);
  const { data: groupRatings } = useRatingsQuery(groupId);
  const { data: groupIdeas } = useGroupIdeasQuery(groupId);

  const selectedLabelIds = useGroupFilterStore(
    (state) => state.filter.labelIds
  );

  const getAvgIdeaRating = useCallback(
    (ideaId: string) => {
      if (!groupRatings) return null;
      const ideaRatings = groupRatings.filter((r) => r.ideaId === ideaId);
      if (ideaRatings.length === 0) return null;

      const validRatings = ideaRatings.filter((r) => r.rating !== null);
      const sum = validRatings.reduce(
        (partialSum, r) => partialSum + (r.rating || 0),
        0
      );

      if (sum === 0) return null;
      return sum / validRatings.length;
    },
    [groupRatings]
  );

  const ideaRatings = useMemo(() => {
    if (!groupIdeas || !groupRatings || !authUser) return [];

    let results: IdeaRating[] = groupIdeas.map((idea) => ({
      idea,
      subideas: subideas?.filter((s) => s.parentId === idea.id) || [],
      yourRating:
        groupRatings.find(
          (gr) => gr.userId === authUser.id && gr.ideaId === idea.id
        )?.rating || null,
      avgRating: getAvgIdeaRating(idea.id),
      otherUserGroupRatings: otherMembers.map((member) => ({
        userGroup: member,
        rating:
          groupRatings.find(
            (rating) =>
              rating.userId === member.user.id && rating.ideaId === idea.id
          )?.rating || null,
      })),
    }));

    if (selectedLabelIds.length > 0)
      results = results.filter((r) => {
        const labelIds = r.idea.labels.map((l) => l.id);
        return selectedLabelIds.every((id) => labelIds.includes(id));
      });

    return results;
  }, [
    authUser,
    groupIdeas,
    subideas,
    otherMembers,
    groupRatings,
    selectedLabelIds,
    tabId,
  ]);

  return ideaRatings;
};

export default useIdeaRatingsQueryUtils;
