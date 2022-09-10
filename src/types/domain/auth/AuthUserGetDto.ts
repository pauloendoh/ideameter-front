import { ProfileDto } from "../profile/ProfileDto";

export default interface AuthUserGetDto {
  id: string;
  username: string;
  email: string;
  token: string;
  expiresAt: string;
  profile: ProfileDto | null;
}

export const buildAuthUserGetDto = (
  p?: Partial<AuthUserGetDto>
): AuthUserGetDto => ({
  id: "",
  username: "",
  email: "",
  token: "",
  expiresAt: new Date().toISOString(),
  profile: null,
  ...p,
});
