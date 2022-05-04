const queryKeys = {
  groups: "groups",
  groupMembers: (groupId: string) => `/group/${groupId}/members`,
  userSearchResults: "userSearchResults",

  groupTabs: (groupId: string) => `/group/${groupId}/tabs`,
};

export default queryKeys;
