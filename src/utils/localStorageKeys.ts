export const localStorageKeys = {
  sortByHighlyRatedIdeasPage: "sortByHighlyRatedIdeasPage",
  lastOpenedTabId: (groupId: string) => `lastOpenedTabId-${groupId}`,

  highlyRatedPage: {
    minReward: "/highly-rated-page/min-reward",
    completedIdeasRange: "completed-ideas-range",
  },
} as const
