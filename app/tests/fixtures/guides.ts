import type { PublishedGuide } from "../../src/content/published-guides";
// Synthetic public contract; never a production registry entry or real approval.
export function guideFixture(): PublishedGuide {
  return {
    exerciseId: "squat",
    version: "synthetic-v1",
    reviewVersion: "SYNTHETIC-ONLY",
    claims: [
      {
        id: "fixture",
        kind: "biomechanical_inference",
        text: "합성 테스트 설명",
        limits: "실제 운동 안내가 아닙니다",
        sourceIds: ["SRC-test"],
      },
    ],
    sources: [
      {
        id: "SRC-test",
        url: "https://example.invalid/source",
        readScope: "full_review",
      },
    ],
    assets: [],
  };
}
