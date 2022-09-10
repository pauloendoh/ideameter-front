import { ProfileDto } from "../profile/ProfileDto";

export default interface UserWithProfileDto {
  id: string;
  email: string;
  username: string;
  profile: ProfileDto | null;
}
