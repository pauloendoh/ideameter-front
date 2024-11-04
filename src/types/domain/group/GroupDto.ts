export default interface GroupDto {
  id?: string
  creatorId?: string

  imageUrl: string | null
  name: string
  description: string

  lastOpenedAt?: string
  createdAt?: string
  updatedAt?: string

  tabs?: { id: string; name: string }[]

  minRating: number
  maxRating: number
  ratingInputType: "dropdown" | "numeric"
  dropdownValueLabels: string[]
}

export const newGroupDto = (): GroupDto => ({
  id: undefined,
  imageUrl: null,
  name: "",
  description: "",

  minRating: 1,
  maxRating: 3,

  ratingInputType: "dropdown",
  dropdownValueLabels: [
    "Not interesting",
    "Kinda interesting",
    "Very interesting",
  ],
})
