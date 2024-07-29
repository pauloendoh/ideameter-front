import IdeaDto from "@/types/domain/group/tab/idea/IdeaDto"

export const calculateIdeaResult = (idea: IdeaDto): number => {
  const rewarding = idea.rewarding || 0
  const discomfortZone = idea.discomfortZone || 0

  return Math.pow(rewarding, 2) * discomfortZone
}
