export default function textContainsWords(text: string, words: string) {
  const normalizedText = text
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
  const normalizedWords = words
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

  const wordArray = normalizedWords.split(" ")

  return wordArray.every((w) => normalizedText.includes(w))
}
