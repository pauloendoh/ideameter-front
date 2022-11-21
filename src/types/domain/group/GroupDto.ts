export default interface GroupDto {
  id?: string
  creatorId?: string

  imageUrl: string | null
  name: string
  description: string

  lastOpenedAt?: string
  createdAt?: string
  updatedAt?: string
}

export const newGroupDto = (): GroupDto => ({
  id: undefined,
  imageUrl: null,
  name: "",
  description: "",
})
