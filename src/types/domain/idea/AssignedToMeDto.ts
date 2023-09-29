import IdeaDto from "../group/tab/idea/IdeaDto"

export interface AssignedToMeDto {
  idea: IdeaDto
  group: {
    groupId: string
    name: string
  }
  tab: {
    id: string
    name: string
  }
}
