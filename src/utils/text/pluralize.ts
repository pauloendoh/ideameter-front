export const pluralize = (params: {
  count: number
  word: string
  customPlural?: string
}) => {
  const { count, word, customPlural } = params

  if (count === 1) {
    return word
  }

  if (customPlural) {
    return customPlural
  }

  return `${word}s`
}
