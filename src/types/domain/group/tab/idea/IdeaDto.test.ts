import { describe, expect, it } from "vitest"
import { buildIdeaDto } from "./IdeaDto"

describe("IdeaDto", () => {
  describe("buildIdeaDto", () => {
    describe("when building an ideaDto", () => {
      it("the default should 'onFireSince' should be not null", () => {
        const dto = buildIdeaDto()
        expect(dto.onFireSince).not.toBe(null)
      })
    })
  })
})
