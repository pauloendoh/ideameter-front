import { IdeaSortAttributeType } from "./IdeaSortingTypes"

export const ideaSortOptionsDivided: {
  attribute: IdeaSortAttributeType
  buttonLabel: string
  menuText: string
}[][] = [
  [
    {
      attribute: "avgRating",
      buttonLabel: "by Avg Rating",
      menuText: "Avg Rating",
    },
    {
      attribute: "highImpactVotesCount",
      buttonLabel: "by Quick Return",
      menuText: "Quick Return",
    },
  ],
  [
    {
      attribute: "requiresYourRating",
      buttonLabel: "Requires your rating",
      menuText: "Requires your rating",
    },
  ],
  [
    {
      attribute: "createdAt",
      buttonLabel: "by Creation Date",
      menuText: "Creation Date",
    },
    {
      attribute: "updatedAt",
      buttonLabel: "by Update Date",
      menuText: "Update Date",
    },
    {
      attribute: "completedAt",
      buttonLabel: "by Completed Date",
      menuText: "Completed Date",
    },
    {
      attribute: "highVotedAt",
      buttonLabel: "by Quick Return Voted Date",
      menuText: "Quick Return Voted Date",
    },
    {
      attribute: "experience",
      buttonLabel: "by Experience",
      menuText: "Experience",
    },
  ],
  [
    {
      attribute: "irrelevantSince",
      buttonLabel: "by Irrelevant Since",
      menuText: "Irrelevant Since",
    },
  ],
]

export const findSortOptionByAttribute = (attribute: IdeaSortAttributeType) => {
  const division = ideaSortOptionsDivided.find((options) =>
    options.find((option) => option.attribute === attribute)
  )

  const option = division?.find((option) => option.attribute === attribute)
  return option
}
