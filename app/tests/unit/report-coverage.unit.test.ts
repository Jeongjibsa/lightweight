import { expect, it } from "vitest";
import { reportCoverage } from "../../src/domain/report-coverage";
import {
  now,
  otherOwner,
  profileFixture,
  sessionFixture,
  setFixture,
} from "../fixtures/training";

it("owner/삭제/취소/미래/진행 중을 구분하고 동일 날짜의 횟수와 일수를 분리한다", () => {
  const sessions = [
    sessionFixture(),
    sessionFixture(),
    sessionFixture({ ownerId: otherOwner }),
    sessionFixture({ deletedAt: now.toISOString() }),
    sessionFixture({ status: "cancelled" }),
    sessionFixture({ localDate: "2026-10-05" }),
    sessionFixture({ status: "active", endedAt: null }),
  ];
  const result = reportCoverage(profileFixture(), sessions, now);
  expect(result).toMatchObject({
    start: "2026-09-28",
    end: "2026-10-04",
    completedSessions: 2,
    completedDays: 1,
    completedRows: 2,
    missingRir: 2,
    comparableConditions: 0,
  });
  expect(result.activeSession?.id).toBe(sessions[6]!.id);
});
it("0kg/준비·미완료/선택RIR을 구분하고 수정 뒤 점검과 revision이 바뀐다", () => {
  const s = sessionFixture({
    status: "partial",
    sets: [
      setFixture({ load: 0, rir: 0 }),
      setFixture({ kind: "warmup" }),
      setFixture({ completedAt: null, load: null, reps: null }),
    ],
  });
  const before = reportCoverage(profileFixture(), [s], now);
  expect(before).toMatchObject({
    completedRows: 1,
    missingRir: 0,
    incompleteRows: 1,
    completedSessions: 1,
  });
  const after = reportCoverage(
    profileFixture(),
    [
      {
        ...s,
        revision: s.revision + 1,
        sets: s.sets.map((set) => ({ ...set, kind: "warmup" })),
      },
    ],
    now,
  );
  expect(after).toMatchObject({
    completedRows: 0,
    completedSessions: 0,
    incompleteRows: 0,
  });
  expect(after.inputRevision).not.toBe(before.inputRevision);
});
it("동일 조건·서로 다른 날짜만 비교하고 새 장비·좌우·이름은 따로 센다", () => {
  const set = setFixture();
  const sessions = [
    sessionFixture({ sets: [set], localDate: "2026-10-01" }),
    sessionFixture({
      sets: [setFixture({ unit: "lb", load: 44.09 })],
      localDate: "2026-10-02",
    }),
    sessionFixture({
      sets: [
        setFixture({ side: "left" }),
        setFixture({ exercise: { ...set.exercise, equipment: "다른 머신" } }),
        setFixture({ exercise: { ...set.exercise, name: "다른 변형" } }),
      ],
      localDate: "2026-10-03",
    }),
  ];
  expect(
    reportCoverage(profileFixture(), sessions, now).comparableConditions,
  ).toBe(1);
  expect(
    reportCoverage(
      profileFixture(),
      [sessions[0]!, { ...sessions[1]!, localDate: "2026-10-01" }],
      now,
    ).comparableConditions,
  ).toBe(0);
});
it("사용자 시간대의 월요일 경계를 적용하고 미설정·다른 기록 시간대를 보존한다", () => {
  const date = new Date("2026-10-04T15:30:00Z");
  const sessions = [
    sessionFixture({ localDate: "2026-10-04" }),
    sessionFixture({
      localDate: "2026-10-05",
      timeZone: "America/Los_Angeles",
    }),
  ];
  expect(
    reportCoverage(profileFixture({ preferences: null }), sessions, date),
  ).toMatchObject({
    start: "2026-10-05",
    end: "2026-10-05",
    completedSessions: 1,
    goal: null,
    mixedTimeZones: true,
  });
  expect(
    reportCoverage(
      profileFixture({ timeZone: "America/Los_Angeles" }),
      sessions,
      date,
    ),
  ).toMatchObject({
    start: "2026-09-28",
    end: "2026-10-04",
    completedSessions: 1,
  });
});
