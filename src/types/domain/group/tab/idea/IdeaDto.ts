import LabelDto from "@/types/domain/label/LabelDto";

export default interface IdeaDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  tabId: string | null;

  parentId?: string;
  name: string;
  description: string;
  isDone: boolean;

  labels: LabelDto[];
  assignedUsers: {
    id: string;
    username: string;
    email: string;
  }[];
}

export const newIdeaDto = (partial?: Partial<IdeaDto>): IdeaDto => ({
  id: "",
  createdAt: "",
  updatedAt: "",
  creatorId: "",
  tabId: "",
  name: "",
  description: "",
  isDone: false,
  labels: [],
  assignedUsers: [],
  ...partial,
});
