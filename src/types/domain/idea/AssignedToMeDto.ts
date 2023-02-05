export interface AssignedToMeDto {
  idea: {
    id: string
    name: string
    isDone: boolean
    completedAt: string | null
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
