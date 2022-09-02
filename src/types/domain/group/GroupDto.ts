export default interface GroupDto {
  id?: string;
  creatorId?: string;

  name: string;
  description: string;

  lastOpenedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const newGroupDto = (): GroupDto => ({
  id: undefined,
  name: "",
  description: "",
});
