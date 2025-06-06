export default interface RatingDto {
  id: string
  userId: string

  idea?: {
    id: string
    parentId: string | null
  }
  ideaId: string
  createdAt: string
  updatedAt: string
  rating: number | null

  position: number | null
}

export const buildRatingDto = (
  ideaId: string,
  rating: number | null
): RatingDto => ({
  id: "",
  userId: "",
  ideaId,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  rating,
  position: null,
})
