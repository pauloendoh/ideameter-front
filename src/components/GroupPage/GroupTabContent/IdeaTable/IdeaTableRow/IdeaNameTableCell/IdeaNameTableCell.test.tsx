import TestProviders from "@/components/Providers/TestProviders"
import { render } from "@testing-library/react"
import { describe, expect, test } from "vitest"

describe("IdeaNameTableCell", () => {
  test("blabla", async () => {
    const Test = () => {
      return <></>
    }

    render(
      <TestProviders>
        <Test />
      </TestProviders>
    )

    expect(true).toBeDefined()
  })
})
