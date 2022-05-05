export default interface IdeaDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  tabId: string | null;
  name: string;
  description: string;
}

export const newIdeaDto = (partial?: Partial<IdeaDto>): IdeaDto => ({
  id: "",
  createdAt: "",
  updatedAt: "",
  creatorId: "",
  tabId: "",
  name: "",
  description: "",
  ...partial,
});
