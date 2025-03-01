export type IdeaSortAttributeType =
  | "avgRating"
  | "highImpactVotesCount"
  | "irrelevantSince"
  | "createdAt"
  | "updatedAt"
  | "completedAt"
  | "requiresYourRating"
  | "highVotedAt"
  | "experience"
  | "rewarding"

export type SortOrderType = "desc" | "asc"

export interface ISortOption {
  attribute: IdeaSortAttributeType
  order: SortOrderType
}
