import { render, screen, within } from "@testing-library/react"
import { expect, test } from "vitest"

test("IdeaDialogRatingsAccordion.test", () => {
  render(<div role="main">hello</div>)

  const main = within(screen.getByRole("main"))

  expect(main).toBeDefined()
})
