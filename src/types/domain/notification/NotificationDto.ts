import IdeaDto from "../group/tab/idea/IdeaDto"
import SimpleUserDto from "../user/SimpleUserDto"

export interface NotificationDto {
  ideaDescriptionMention: null | {
    idea: IdeaDto
    mentionBy: SimpleUserDto
  }
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  showDot: boolean
}

interface RootObject {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  showDot: boolean
  ideaDescriptionMention: IdeaDescriptionMention
}

interface IdeaDescriptionMention {
  idea: Idea
  mentionBy: MentionBy
}

interface MentionBy {
  id: string
  username: string
  email: string
}

interface Idea {
  id: string
  createdAt: string
  updatedAt: string
  parentId?: any
  creatorId: string
  tabId: string
  name: string
  description: string
  isDone: boolean
  onFireSince?: any
  irrelevantSince?: any
  tab: Tab
}

interface Tab {
  group: Group
}

interface Group {
  id: string
  creatorId: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}
