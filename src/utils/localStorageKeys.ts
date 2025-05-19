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
    assignedToMeFilter: "/highly-rated-page/assigned-to-me-filter",
    customSortingBy: "/highly-rated-page/custom-sorting-by",
  },
} as const
