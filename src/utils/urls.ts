import { stringify } from "querystring"

const { NEXT_PUBLIC_API_URL } = process.env

const urls = {
  pages: {
    index: "/",
    groupId: (groupId: string) => `/group/${groupId}`,
    groupTab: (groupId: string, tabId: string) => `/group/${groupId}?tabId=${tabId}`,
    groupTabIdea: (groupId: string, tabId: string, ideaId: string) =>
      `/group/${groupId}?${stringify({ tabId, ideaId })}`,
  },
  api: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    sendPasswordResetEmail: "/utils/password-reset-email",
    resetPassword: "/auth/password-reset",
    ideasAssignedToMe: `ideas/assigned-to-me`,
    group: "/group",
    groupId: (groupId: string) => `/group/${groupId}`,
    groupMembers: (groupdId: string) => `/group/${groupdId}/members`,
    groupMemberId: (groupdId: string, memberId: string) =>
      `/group/${groupdId}/members/${memberId}`,
    groupAdmin: "/group/admin",
    groupUser: (groupId: string, userId: string) => `/group/${groupId}/users/${userId}`,
    groupTab: (groupId: string) => `/group/${groupId}/tab`,
    groupRatings: (groupId: string) => `/group/${groupId}/ratings`,
    groupLabels: (groupId: string) => `/group/${groupId}/labels`,

    groupIdeas: (groupId: string) => `/group/${groupId}/ideas`,
    groupImage: "/group/image",
    tabId: (tabId: string) => `/tabs/${tabId}`,
    tabIdea: (tabId: string) => `/group/any/tab/${tabId}/idea`,
    subideas: (groupId: string) => `/subideas?groupId=${groupId}`,
    subideaId: (id: string) => `/subideas/${id}`,

    moveIdeasToTab: `/ideas/move-to-tab`,

    ideaId: (ideaId: string) => `/idea/${ideaId}`,
    ideaName: (ideaId: string) => `/idea/${ideaId}/name`,
    ideaRating: (ideaId: string) => `/idea/${ideaId}/rating`,

    labelId: (labelId: string) => `/labels/${labelId}`,

    userSearch: (query: string) => `/user/search?q=${query}`,

    lastOpenedGroupId: `/me/lastOpenedGroupId`,

    profilesPicture: "/profiles/picture",
    rteImages: "/rte-images",

    notifications: "/notifications",
    notificationsHideDots: "/notifications/hide-dots",

    // insights
    interestSimilarity: (groupId: string) =>
      `/groups/${groupId}/insights/interest-similarity`,
  },
  ws: {
    groupId: (groupId: string) => `${NEXT_PUBLIC_API_URL}/groups/${groupId}`,
  },
}

export default urls
