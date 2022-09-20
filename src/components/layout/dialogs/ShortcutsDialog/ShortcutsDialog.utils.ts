interface Section {
  title: string
  shortcuts: Shortcut[]
}

interface Shortcut {
  name: string
  shortcut: string
}

export const shortcutSections: Section[] = [
  {
    title: "Mouse over idea",
    shortcuts: [
      { name: "Assign idea to me", shortcut: "A" },
      { name: "Vote idea as high impact", shortcut: "V" },
    ],
  },

  {
    title: "Idea filter",
    shortcuts: [
      { name: "Filter ideas assigned to you", shortcut: "Shift + 2" },
    ],
  },
]
