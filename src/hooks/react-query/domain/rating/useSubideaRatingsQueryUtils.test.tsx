import { cleanup } from "@testing-library/react"

import { afterEach, describe, expect, it } from "vitest"

describe("useSubideaRatingsQueryUtils", () => {
  afterEach(() => {
    cleanup()
  })

  describe("when group has one idea with one subidea", async () => {
    describe.todo("and when you have a null rating", async () => {
      // const { data } = useSubideaRatingsQueryUtils("", "")

      it("should save yourRating as null", async () => {
        expect(true).toBe(true)
      })
    })

    describe.todo("and when you have NOT rated it", async () => {
      it("should save yourRating as undefined", async () => {
        expect(true).toBe(true)
      })
    })
  })
})
