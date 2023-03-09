import SimpleUserDto from "@/types/domain/user/SimpleUserDto"

export type CommentDto = {
  id: string
  createdAt: string
  updatedAt: string
  userId: string
  user?: SimpleUserDto
  targetIdeaId: string | null
  targetCommentId: string | null
  text: string
}

export const buildCommentDto = (p?: Partial<CommentDto>): CommentDto => ({
  id: "",
  createdAt: "",
  updatedAt: "",
  userId: "",
  targetIdeaId: null,
  targetCommentId: null,
  text: "",
  ...p,
})
