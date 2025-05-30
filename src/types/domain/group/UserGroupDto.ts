import SimpleUserDto from "../user/SimpleUserDto"

// PE 1/3 - rename to GroupMemberDto
export default interface UserGroupDto {
  userId: string
  groupId: string
  createdAt: string
  updatedAt: string
  isAdmin: boolean

  user?: SimpleUserDto
}
