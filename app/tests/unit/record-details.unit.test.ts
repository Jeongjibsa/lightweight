import { expect, it } from "vitest";
import { comparisonSchema, sessionSchema } from "../../src/domain/models";
import {
  conditionKey,
  volumeConditions,
  volumeDays,
} from "../../src/domain/volume";
import { reportCoverage } from "../../src/domain/report-coverage";
import { conditionChoices } from "../../src/components/volume-format";
import {
  owner,
  profileFixture,
  sessionFixture,
  setFixture,
} from "../fixtures/training";
it("미입력/빈 조건의 legacy key는 같고 장비·ROM 차이는 독립 계열이다", () => {
  const old = setFixture();
  const a = setFixture({
    comparison: { equipmentLabel: "머신 A", rangeOfMotion: "전체" },
  });
  const b = setFixture({
    comparison: { equipmentLabel: "머신 B", rangeOfMotion: "전체" },
  });
  const short = setFixture({
    comparison: { equipmentLabel: "머신 A", rangeOfMotion: "짧게" },
  });
  expect(conditionKey(old)).toBe(
    conditionKey(
      setFixture({ comparison: { equipmentLabel: " ", rangeOfMotion: "" } }),
    ),
  );
  const records = [
    sessionFixture({
      sets: [
        old,
        a,
        b,
        short,
        setFixture({
          ...a,
          id: crypto.randomUUID(),
          unit: "lb",
          load: 10,
          reps: 2,
        }),
      ],
    }),
  ];
  const conditions = volumeConditions(records, owner, "2026-10-04");
  expect(conditions).toHaveLength(4);
  expect(
    volumeDays(records, owner, "2026-10-04", "all", conditionKey(a))[0]!.volume,
  ).toBeCloseTo(209.0718474, 7);
  expect(
    volumeDays(records, owner, "2026-10-04", "all", conditionKey(b))[0]!.volume,
  ).toBe(200);
  expect(conditionChoices(conditions).map((c) => c.label)).toEqual(
    expect.arrayContaining([
      expect.stringContaining("머신 A · 전체"),
      expect.stringContaining("머신 A · 짧게"),
      expect.stringContaining("비교 조건 미입력"),
    ]),
  );
});
it("주간 동일 조건 날짜 수에 서로 다른 장비를 섞지 않는다", () => {
  const records = ["2026-09-28", "2026-09-29"].map((localDate, i) =>
    sessionFixture({
      localDate,
      sets: [
        setFixture({
          comparison: { equipmentLabel: `머신 ${i}`, rangeOfMotion: "전체" },
        }),
      ],
    }),
  );
  const coverage = reportCoverage(
    profileFixture(),
    records,
    new Date("2026-10-04T03:00:00Z"),
  );
  expect(coverage.comparableConditions).toBe(0);
  expect(coverage.completedRows).toBe(2);
});
it("옛 기록을 그대로 읽고 메모/조건의 길이·정규화를 검증한다", () => {
  const old = sessionFixture();
  expect(sessionSchema.parse(old)).toEqual(old);
  expect(
    comparisonSchema.parse({ equipmentLabel: " 머신 A ", rangeOfMotion: " " }),
  ).toEqual({ equipmentLabel: "머신 A", rangeOfMotion: "" });
  expect(
    comparisonSchema.safeParse({
      equipmentLabel: "x".repeat(81),
      rangeOfMotion: "",
    }).success,
  ).toBe(false);
  expect(
    sessionSchema.safeParse({ ...old, note: "x".repeat(1001) }).success,
  ).toBe(false);
});
