export type IdeaSortAttributeType =
  | "avgRating"
  | "irrelevantSince"
  | "createdAt"
  | "updatedAt"
  | "completedAt"
  | "requiresYourRating"

export type SortOrderType = "desc" | "asc"

export interface ISortOption {
  attribute: IdeaSortAttributeType
  order: SortOrderType
}
