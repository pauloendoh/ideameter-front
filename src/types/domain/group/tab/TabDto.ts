export default interface TabDto {
  id: string;
  creatorId: string;
  groupId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const newTabDto = (partial?: Partial<TabDto>): TabDto => ({
  id: "",
  creatorId: "",
  groupId: "",
  name: "",
  createdAt: "",
  updatedAt: "",

  ...partial,
});
