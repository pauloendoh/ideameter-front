import { ProfileDto } from "../profile/ProfileDto"

export default interface SimpleUserDto {
  id: string
  email: string
  username: string
  profile?: ProfileDto
}
