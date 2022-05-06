export default interface LabelDto {
  id: string;
  createdAt: string;
  updatedAt: string;

  groupId: string;

  name: string;
  bgColor: string;
}

export const newLabelDto = (groupId: string): LabelDto => ({
  id: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  groupId: groupId,

  name: "",
  bgColor: "#61bd4f",
});
