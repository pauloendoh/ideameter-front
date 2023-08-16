import { HighImpactVoteDto } from "../high-impact-votes/HighImpactVoteDto"

export interface AssignedToMeDto {
  idea: {
    id: string
    name: string
    isDone: boolean
    completedAt: string | null
    createdAt: string
    highImpactVotes: HighImpactVoteDto[]
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
