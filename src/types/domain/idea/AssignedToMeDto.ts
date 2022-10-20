export interface AssignedToMeDto {
  idea: {
    id: string
    name: string
    isDone: boolean
  }
  group: {
    groupId: string
    name: string
  }
  tab: {
    id: string
    name: string
  }
}
