export const localStorageKeys = {
  sortByHighlyRatedIdeasPage: "sortByHighlyRatedIdeasPage",
  lastOpenedTabId: (groupId: string) => `lastOpenedTabId-${groupId}`,
} as const
