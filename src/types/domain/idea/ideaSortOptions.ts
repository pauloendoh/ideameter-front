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
