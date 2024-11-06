import { stringify } from "querystring"

const { NEXT_PUBLIC_API_URL } = process.env

const urls = {
  pages: {
    index: "/",
    groupId: (groupId: string) => `/group/${groupId}`,
    groupTab: (groupId: string, tabId: string) =>
      `/group/${groupId}?tabId=${tabId}`,
    groupTabIdea: (groupId: string, tabId: string, ideaId: string) =>
      `/group/${groupId}?${stringify({ tabId, ideaId })}`,
    ideaHighlights: "/idea-highlights",
  },
  api: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    sendPasswordResetEmail: "/utils/password-reset-email",
    resetPassword: "/auth/password-reset",
    ideasAssignedToMe: `ideas/assigned-to-me`,
    highImpactVotedByMe: `ideas/high-impact-voted-by-me`,
    highlyRatedIdeasByMe: `ideas/highly-rated-ideas-by-me`,

    group: "/group",
    groupId: (groupId: string) => `/group/${groupId}`,
    groupMembers: (groupId: string) => `/group/${groupId}/members`,
    groupMembersLastOnline: (groupId: string, asUserId: string) =>
      `/group/${groupId}/members-last-online?asUserId=${asUserId}`,
    groupMemberId: (groupId: string, memberId: string) =>
      `/group/${groupId}/members/${memberId}`,
    groupAdmin: "/group/admin",
    groupUser: (groupId: string, userId: string) =>
      `/group/${groupId}/users/${userId}`,
    groupTab: (groupId: string) => `/group/${groupId}/tab`,
    groupRatings: (groupId: string) => `/group/${groupId}/ratings`,
    groupLabels: (groupId: string) => `/group/${groupId}/labels`,
    labelsToImport: (groupId: string) => `/group/${groupId}/labels-to-import`,
    importLabels: (groupId: string) => `/group/${groupId}/import-labels`,
    labels: `/labels`,

    groupIdeas: (groupId: string) => `/group/${groupId}/ideas`,
    ideaChanges: (ideaId: string) => `/idea-changes?ideaId=${ideaId}`,
    ideaComments: (ideaId: string) => `/comments?ideaId=${ideaId}`,
    archivedIdeas: (groupId: string) => `/archived-ideas?groupId=${groupId}`,
    comments: `/comments`,
    groupImage: "/group/image",
    tabId: (tabId: string) => `/tabs/${tabId}`,
    tabIdea: (tabId: string) => `/group/any/tab/${tabId}/idea`,
    subideas: (groupId: string) => `/subideas?groupId=${groupId}`,
    subideaId: (id: string) => `/subideas/${id}`,
    subideaImage: "/subidea/image",
    transformToSubidea: (ideaId: string, newParentIdeaTitle: string) =>
      `/subideas/transform-to-subidea?ideaId=${ideaId}&newParentIdeaTitle=${newParentIdeaTitle}`,

    moveIdeasToTab: `/ideas/move-to-tab`,

    ideaId: (ideaId: string) => `/idea/${ideaId}`,
    ideaName: (ideaId: string) => `/idea/${ideaId}/name`,
    ideaRating: (ideaId: string) => `/idea/${ideaId}/rating`,

    moveRatingPosition: (ratingId: string) =>
      `/rating/${ratingId}/move-position`,

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
    missingRatingsFromGroup: (groupId: string) =>
      `/groups/${groupId}/insights/missing-ratings`,
    groupMembersLastRatings: (groupId: string) =>
      `/groups/${groupId}/last-ratings`,
    highlightableIdeas: "/highlightable-ideas",
    ideaHighlights: "/idea-highlights",
    toggleIdeaHighlight: (ideaId: string) =>
      `/toggle-idea-highlight?ideaId=${ideaId}`,
    userSettings: `/me/settings`,
    userSettingsHiddenTabsIds: `/me/settings/hidden-tabs-ids`,

    allGroupsAndTabs: "/me/groups/tabs",
    refreshRating: (ratingId: string) => `/rating/${ratingId}/refresh`,
    searchGroupTabs: (query: string) => `/search-group-tabs?q=${query}`,
  },
  ws: {
    groupId: (groupId: string) => `${NEXT_PUBLIC_API_URL}/groups/${groupId}`,
  },
}

export default urls
