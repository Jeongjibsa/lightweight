import { describe, expect, it } from "vitest";
import {
  dateInZone,
  preferencesSchema,
  toKilograms,
  type Preferences,
} from "../../src/domain/models";
const preferences: Preferences = {
  goal: "hypertrophy",
  customGoal: "",
  weeklyMin: 3,
  weeklyMax: 4,
  split: "full_body",
  customSplit: "",
  minutes: null,
  equipment: ["덤벨"],
};

describe("설정·날짜·단위 계약", () => {
  it("잘못된 범위와 비어 있는 사용자 정의 목표를 거부한다", () => {
    expect(
      preferencesSchema.safeParse({
        ...preferences,
        weeklyMin: 5,
        weeklyMax: 3,
      }).success,
    ).toBe(false);
    expect(
      preferencesSchema.safeParse({ ...preferences, goal: "custom" }).success,
    ).toBe(false);
    expect(
      preferencesSchema.safeParse({
        ...preferences,
        split: "custom",
        customSplit: "상체 / 하체",
      }).success,
    ).toBe(true);
  });
  it("날짜 경계와 단위 변환을 명시적으로 처리한다", () => {
    expect(dateInZone(new Date("2026-10-03T16:00:00Z"), "Asia/Seoul")).toBe(
      "2026-10-04",
    );
    expect(
      dateInZone(new Date("2026-10-03T16:00:00Z"), "America/Los_Angeles"),
    ).toBe("2026-10-03");
    expect(toKilograms(100, "lb")).toBeCloseTo(45.359237, 6);
  });
});
