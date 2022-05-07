import useAuthStore from "@/hooks/zustand/domain/auth/useAuthStore";
import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto";
import UserGroupDto from "@/types/domain/group/UserGroupDto";
import { useCallback, useMemo } from "react";
import useOtherMembersQueryUtils from "../group-members/useOtherMembersQueryUtils";
import useGroupRatingsQuery from "./tab/idea/rating/useGroupRatingsQuery";
import useTabIdeasQuery from "./tab/idea/useTabIdeasQuery";

export interface IdeaRating {
  idea: IdeaDto;
  avgRating: number | null;
  yourRating: number | null;
  otherUserGroupRatings: { userGroup: UserGroupDto; rating: number | null }[];
}

const useIdeaRatingsQueryUtils = (groupId: string, tabId: string) => {
  const { authUser } = useAuthStore();
  const { data: tabIdeas } = useTabIdeasQuery(tabId);
  const otherMembers = useOtherMembersQueryUtils(groupId);
  const { data: groupRatings } = useGroupRatingsQuery(groupId);

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
    if (!tabIdeas || !groupRatings || !authUser) return [];

    const results: IdeaRating[] = tabIdeas.map((idea) => ({
      idea,
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

    return results;
  }, [authUser, tabIdeas, otherMembers, groupRatings]);

  console.log(ideaRatings);
  return ideaRatings;
};

export default useIdeaRatingsQueryUtils;
