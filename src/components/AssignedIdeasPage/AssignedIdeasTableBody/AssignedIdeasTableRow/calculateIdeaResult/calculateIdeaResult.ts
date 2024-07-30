import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"

export const calculateIdeaResult = (idea: IdeaDto): number => {
  const rewarding = idea.rewarding || 0
  const discomfortZone = idea.discomfortZone || 0

  const result = Math.pow(rewarding, 2) * Math.pow(discomfortZone, 2)

  return Math.round(result)
}
