export const localStorageKeys = {
  sortByHighlyRatedIdeasPage: "sortByHighlyRatedIdeasPage",
  lastOpenedTabId: (groupId: string) => `lastOpenedTabId-${groupId}`,

  highlyRatedPage: {
    minReward: "/highly-rated-page/min-reward",
    completedIdeasRange: "completed-ideas-range",
    customInitialDate: "custom-initial-date",
    customFinalDate: "custom-final-date",
    ideasWaitingIdeasFilter: "ideas-waiting-ideas-filter",
    requiresChangeFilter: "requires-change-filter",
  },
} as const
