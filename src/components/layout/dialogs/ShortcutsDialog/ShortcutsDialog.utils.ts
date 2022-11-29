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
    title: "General",
    shortcuts: [{ name: "Open new idea", shortcut: "Q" }],
  },

  {
    title: "Mouse over idea",
    shortcuts: [
      { name: "Assign idea to me", shortcut: "A" },
      { name: "Vote idea as high impact", shortcut: "V" },
      { name: "Select idea", shortcut: "Ctrl+Click" },
      { name: "Select range of ideas", shortcut: "Shift+Click" },
    ],
  },
  {
    title: "Idea dialog",
    shortcuts: [
      { name: "Save without closing dialog", shortcut: "Ctrl+S" },
      { name: "Save and close dialog", shortcut: "Ctrl+Enter" },
    ],
  },
  {
    title: "Idea filter",
    shortcuts: [{ name: "Filter ideas assigned to you", shortcut: "Shift + 2" }],
  },
]
