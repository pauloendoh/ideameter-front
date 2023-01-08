import GroupDto from "../group/GroupDto"

export default interface LabelDto {
  id: string
  createdAt: string
  updatedAt: string

  groupId: string
  group?: GroupDto

  name: string
  bgColor: string
}

export const buildLabelDto = (p?: Partial<LabelDto>): LabelDto => ({
  id: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  groupId: "",

  name: "",
  bgColor: "#61bd4f",
  ...p,
})
