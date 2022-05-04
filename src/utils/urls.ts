const urls = {
  pages: {
    groupdId: (groupId: string) => `/group/${groupId}`,
    groupTab: (groupId: string, tabId: string) =>
      `/group/${groupId}?tab=${tabId}`,
  },
  api: {
    register: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",

    group: "/group",
    groupId: (groupId: string) => `/group/${groupId}`,
    groupMembers: (groupdId: string) => `/group/${groupdId}/members`,
    groupMemberId: (groupdId: string, memberId: string) =>
      `/group/${groupdId}/members/${memberId}`,
    groupTab: (groupId: string) => `/group/${groupId}/tab`,

    userSearch: (query: string) => `/user/search?q=${query}`,
  },
};

export default urls;
