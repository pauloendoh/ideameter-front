export default interface GroupMemberDto {
  id: string;
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
