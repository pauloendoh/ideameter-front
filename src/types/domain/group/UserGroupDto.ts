import SimpleUserDto from "../user/SimpleUserDto"

export default interface UserGroupDto {
  userId: string
  groupId: string
  createdAt: string
  updatedAt: string
  isAdmin: boolean

  user: SimpleUserDto
}
