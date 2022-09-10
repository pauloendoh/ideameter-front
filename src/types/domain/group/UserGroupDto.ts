import UserWithProfileDto from "../user/UserWithProfileDto";

export default interface UserGroupDto {
  userId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;

  user: UserWithProfileDto;
}
