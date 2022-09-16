const queryKeys = {
  groups: "groups",
  groupMembers: (groupId?: string) => `/group/${groupId}/members`,
  userSearchResults: "userSearchResults",

  groupIdeas: (groupId: string) => `/group/${groupId}/ideas`,
  groupTabs: (groupId: string) => `/group/${groupId}/tabs`,
  tabIdeas: (tabId: string) => `/tab/${tabId}/ideas`,

  ratingsByGroup: (groupId: string) => `/idea-rating?groupId=${groupId}`,

  subideas: (groupId: string) => ["subideas", "group", groupId],
  subideaRatings: (parentId: string) => [
    "ideas",
    parentId,
    "subideas",
    "ratings",
  ],

  notifications: "/notifications",
}

export default queryKeys
