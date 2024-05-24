import { HighImpactVoteDto } from "@/types/domain/high-impact-votes/HighImpactVoteDto"
import LabelDto from "@/types/domain/label/LabelDto"
import SimpleUserDto from "@/types/domain/user/SimpleUserDto"
import TabDto from "../TabDto"

export default interface IdeaDto {
  id: string
  createdAt: string
  updatedAt: string
  creatorId: string
  isArchived: boolean

  tab?: TabDto
  tabId: string | null

  parentId?: string
  name: string
  description: string
  isDone: boolean
  completedAt: string | null
  onFireSince: string | null
  irrelevantSince: string | null
  ratingsAreEnabled: boolean
  complexity: number

  labels: LabelDto[]
  assignedUsers: SimpleUserDto[]
  highImpactVotes: HighImpactVoteDto[]
  frequencyRate: number | null
  improvementRate: number | null

  subideaImageUrl: string
}

export const buildIdeaDto = (partial?: Partial<IdeaDto>): IdeaDto => ({
  id: "",
  createdAt: "",
  updatedAt: "",
  creatorId: "",
  isArchived: false,

  tabId: "",
  name: "",
  description: "",
  isDone: false,
  completedAt: null,
  onFireSince: new Date().toISOString(),
  irrelevantSince: null,
  ratingsAreEnabled: true,
  complexity: 0,
  frequencyRate: null,
  improvementRate: null,

  labels: [],
  assignedUsers: [],
  highImpactVotes: [],

  subideaImageUrl: "",
  ...partial,
})
