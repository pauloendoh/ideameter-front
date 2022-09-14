export type IdeaSortAttributeType = "avgRating" | "irrelevantSince";

export type SortOrderType = "desc" | "asc";

export interface ISortOption {
  attribute: IdeaSortAttributeType;
  order: SortOrderType;
}
