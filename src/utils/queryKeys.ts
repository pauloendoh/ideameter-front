const queryKeys = {
  groups: "groups",
  groupMembers: (groupId?: string) => `/group/${groupId}/members`,
  groupMembersLastOnline: (groupId?: string, asUserId?: string) =>
    `/group/${groupId}/members-last-online?asUserId=${asUserId}`,
  userSearchResults: "userSearchResults",

  groupIdeas: (groupId: string) => `/group/${groupId}/ideas`,
  groupTabs: (groupId: string) => `/group/${groupId}/tabs`,
  tabIdeas: (tabId: string) => `/tab/${tabId}/ideas`,

  ratingsByGroup: (groupId: string) => `/idea-rating?groupId=${groupId}`,

  subideas: (groupId: string) => ["subideas", "group", groupId],
  ideaChanges: (ideaId: string) => ["idea-changes", ideaId],

  notifications: "/notifications",
  interestSimilarity: (groupId: string) =>
    `/groups/${groupId}/insights/interest-similarity`,
  assignedToMeIdeas: "assigned-to-me",
  highImpactVotedByMe: "high-impact-voted-by-me",
  missingRatingsFromGroup: (groupId: string) =>
    `/groups/${groupId}/insights/missing-ratings`,
  ideaComments: (ideaId: string) => ["comments", ideaId],
  archivedIdeas: (groupId: string) => `/archived-ideas?groupId=${groupId}`,
  highlightableIdeas: "/highlightable-ideas",
  ideaHighlights: "/idea-highlights",
}

export default queryKeys
