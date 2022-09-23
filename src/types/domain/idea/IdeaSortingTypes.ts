export type IdeaSortAttributeType =
  | "avgRating"
  | "irrelevantSince"
  | "createdAt"
  | "updatedAt"
  | "requiresYourRating"

export type SortOrderType = "desc" | "asc"

export interface ISortOption {
  attribute: IdeaSortAttributeType
  order: SortOrderType
}
