import GroupDto from "../GroupDto"

export default interface TabDto {
  id: string
  creatorId: string

  group?: GroupDto
  groupId: string
  name: string
  createdAt: string
  updatedAt: string
}

export const buildTabDto = (partial?: Partial<TabDto>): TabDto => ({
  id: "",
  creatorId: "",
  groupId: "",
  name: "",
  createdAt: "",
  updatedAt: "",

  ...partial,
})
