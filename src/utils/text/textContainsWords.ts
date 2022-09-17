export default function textContainsWords(_text: string, _words: string) {
  const text = _text
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
  const words = _words
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

  const wordArray = words.split(" ")

  return wordArray.every((w) => text.includes(w))
}
