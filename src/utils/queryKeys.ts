const queryKeys = {
  groups: "groups",
  groupMembers: (groupId: string) => `/group/${groupId}/members`,
  userSearchResults: "userSearchResults",

  groupTabs: (groupId: string) => `/group/${groupId}/tabs`,
  tabIdeas: (tabId: string) => `/tab/${tabId}/ideas`,

  ratingsByGroup: (groupId: string) => `/idea-rating?groupId=${groupId}`,

  subideas: (parentId: string) => ["ideas", parentId, "subideas"],
  subideaRatings: (parentId: string) => [
    "ideas",
    parentId,
    "subideas",
    "ratings",
  ],
};

export default queryKeys;
