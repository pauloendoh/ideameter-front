import IdeaDto from "../group/tab/idea/IdeaDto"
import RatingDto from "../group/tab/idea/rating/RatingDto"

export interface AssignedToMeDto {
  idea: IdeaDto
  group: {
    groupId: string
    name: string
  }
  tab: {
    tabId: string
    name: string
  }
  myRating: RatingDto
  iAmAssigned: true
}
