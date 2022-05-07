export default interface UserGroupDto {
  userId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;

  user: {
    id: string;
    username: string;
  };
}
