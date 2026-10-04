import { expect, it } from "vitest";
import { samePreferences, todayCandidate } from "../../src/domain/history";
import {
  now,
  otherOwner,
  profileFixture,
  routineFixture,
  sessionFixture,
  setFixture,
} from "../fixtures/training";

it("최근 수행하지 않은 본인 루틴부터 후보로 고르고 실제 세션을 변형하지 않는다", () => {
  const a = routineFixture({ name: "A" });
  const b = routineFixture({ name: "B" });
  const records = [sessionFixture({ routineSnapshot: a })];
  const before = structuredClone(records);
  const candidate = todayCandidate(profileFixture(), [a, b], records, now);
  expect(candidate).toMatchObject({
    state: "candidate",
    routine: b,
    previous: null,
    historyCount: 1,
  });
  expect(records).toEqual(before);
});
it("가장 오래된 루틴의 최신 실제 완료를 참고하며 partial/현재 계획을 별도로 유지한다", () => {
  const a = routineFixture({ name: "A" });
  const b = routineFixture({ name: "B" });
  const older = sessionFixture({ routineSnapshot: a, localDate: "2026-09-10" });
  const partial = sessionFixture({
    routineSnapshot: a,
    localDate: "2026-09-20",
    status: "partial",
    sets: [setFixture({ load: 0 }), setFixture({ completedAt: null })],
  });
  const latest = sessionFixture({
    routineSnapshot: b,
    localDate: "2026-10-01",
  });
  expect(
    todayCandidate(profileFixture(), [b, a], [latest, older, partial], now),
  ).toMatchObject({ state: "candidate", routine: a, previous: partial });
});
it("active와 오늘 완료가 있으면 다른 owner/삭제/취소를 제외한 뒤 추가 후보를 보류한다", () => {
  const r = routineFixture();
  const past = sessionFixture({ routineSnapshot: r });
  expect(
    todayCandidate(
      profileFixture(),
      [r],
      [past, sessionFixture({ status: "active", endedAt: null })],
      now,
    ),
  ).toMatchObject({ state: "held", reason: "active" });
  expect(
    todayCandidate(
      profileFixture(),
      [r],
      [past, sessionFixture({ localDate: "2026-10-04" })],
      now,
    ),
  ).toMatchObject({ state: "held", reason: "today" });
  expect(
    todayCandidate(
      profileFixture(),
      [r],
      [
        past,
        sessionFixture({
          ownerId: otherOwner,
          status: "active",
          endedAt: null,
        }),
        sessionFixture({
          status: "active",
          endedAt: null,
          deletedAt: "2026-10-02T03:00:00Z",
        }),
        sessionFixture({ localDate: "2026-10-04", status: "cancelled" }),
      ],
      now,
    ).state,
  ).toBe("candidate");
});
it("사용자 시간대의 오늘과 최근 28일 종료 본세트만 참고한다", () => {
  const r = routineFixture();
  const records = [
    sessionFixture({ localDate: "2026-09-05" }),
    sessionFixture({ localDate: "2026-10-05" }),
    sessionFixture({ sets: [setFixture({ kind: "warmup" })] }),
  ];
  expect(todayCandidate(profileFixture(), [r], records, now)).toMatchObject({
    state: "held",
    reason: "history",
  });
  expect(
    todayCandidate(
      profileFixture(),
      [r],
      [sessionFixture({ localDate: "2026-09-06" })],
      now,
    ).state,
  ).toBe("candidate");
  const boundary = new Date("2026-10-03T16:00:00Z");
  expect(
    todayCandidate(
      profileFixture(),
      [r],
      [sessionFixture({ localDate: "2026-10-03" })],
      boundary,
    ).state,
  ).toBe("candidate");
  expect(
    todayCandidate(
      profileFixture({ timeZone: "America/Los_Angeles" }),
      [r],
      [sessionFixture({ localDate: "2026-10-03" })],
      boundary,
    ),
  ).toMatchObject({ state: "held", reason: "today" });
});
it("과거 설정의 목표/분할/횟수/시간/장비 변경과 null을 근거에서 제외한다", () => {
  const profile = profileFixture();
  const p = profile.preferences!;
  const variants = [
    null,
    { ...p, goal: "strength" as const },
    { ...p, split: "two_way" as const },
    { ...p, weeklyMin: 2 },
    { ...p, minutes: 90 },
    { ...p, equipment: ["덤벨" as const] },
  ];
  const records = variants.map((preferencesSnapshot) =>
    sessionFixture({ preferencesSnapshot }),
  );
  expect(
    todayCandidate(profile, [routineFixture()], records, now),
  ).toMatchObject({ state: "held", reason: "history", changedRecords: 6 });
  expect(
    samePreferences(p, { ...p, equipment: [...p.equipment].reverse() }),
  ).toBe(true);
});
it("부족한 설정·장비·루틴과 다른 owner/장비 미지원/옛 설정 루틴을 보류한다", () => {
  const p = profileFixture();
  const record = sessionFixture();
  expect(
    todayCandidate({ ...p, preferences: null }, [], [], now),
  ).toMatchObject({ state: "held", reason: "settings" });
  expect(
    todayCandidate(
      { ...p, preferences: { ...p.preferences!, equipment: [] } },
      [],
      [],
      now,
    ),
  ).toMatchObject({ state: "held", reason: "equipment" });
  const unsupported = routineFixture({
    exercises: [
      {
        exercise: { ...setFixture().exercise, equipment: "custom rack" },
        sets: 2,
      },
    ],
  });
  const wrong = routineFixture({ ownerId: otherOwner });
  const stale = routineFixture({
    preferencesSnapshot: { ...p.preferences!, goal: "strength" },
  });
  expect(
    todayCandidate(p, [unsupported, wrong, stale], [record], now),
  ).toMatchObject({ state: "held", reason: "routines" });
});
