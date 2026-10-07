import { expect, it } from "vitest";
import { publishedGuidesSchema } from "../../src/content/published-guides";
import { guideFixture } from "../fixtures/guides";
it("빈 승인 묶음과 유효 합성 안내를 허용하고 누락/미검토/비공개 필드를 거부한다", () => {
  expect(
    publishedGuidesSchema.parse({
      schemaVersion: 1,
      registryVersion: "test",
      exercises: [],
    }).exercises,
  ).toEqual([]);
  const base = () => ({
    schemaVersion: 1,
    registryVersion: "test",
    exercises: [guideFixture()],
  });
  expect(publishedGuidesSchema.safeParse(base()).success).toBe(true);
  const unknown = base();
  unknown.exercises[0]!.claims[0]!.sourceIds = ["missing"];
  const partial = base();
  partial.exercises[0]!.sources[0]!.readScope = "abstract";
  const duplicate = base();
  duplicate.exercises.push(guideFixture());
  const unsafe = base();
  unsafe.exercises[0]!.sources[0]!.url = "javascript:alert(1)";
  for (const payload of [
    unknown,
    partial,
    duplicate,
    unsafe,
    { ...base(), reviewerId: "private" },
    { ...base(), schemaVersion: 2 },
  ])
    expect(publishedGuidesSchema.safeParse(payload).success).toBe(false);
});
