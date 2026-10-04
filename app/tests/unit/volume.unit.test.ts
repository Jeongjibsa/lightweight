import { expect, it } from "vitest";
import {
  changePercent,
  conditionKey,
  shiftDate,
  totalSets,
  trendSegments,
  volumeConditions,
  volumeDays,
} from "../../src/domain/volume";
import {
  otherOwner,
  owner,
  sessionFixture,
  setFixture,
} from "../fixtures/training";

it("완료 본세트만 관찰하며 owner/삭제/취소/미래/준비/초안을 제외한다", () => {
  const own = sessionFixture({
    status: "active",
    endedAt: null,
    sets: [
      setFixture(),
      setFixture({ kind: "warmup" }),
      setFixture({ completedAt: null }),
    ],
  });
  const records = [
    own,
    sessionFixture({ ownerId: otherOwner }),
    sessionFixture({ deletedAt: "2026-10-02T03:00:00Z" }),
    sessionFixture({ status: "cancelled" }),
    sessionFixture({ localDate: "2026-10-05" }),
  ];
  expect(volumeDays(records, owner, "2026-10-04", "all")).toEqual([
    {
      date: "2026-10-01",
      workingRows: 1,
      reps: 10,
      seconds: null,
      volume: 200,
      volumeRows: 1,
    },
  ]);
  expect(volumeConditions(records, owner, "2026-10-04")).toHaveLength(1);
});
it("하루 여러 세션·lb를 합치되 일별 중량 합계는 total mode만 포함한다", () => {
  const total = setFixture({ unit: "lb", load: 10, reps: 2 });
  const hand = setFixture({
    exercise: { ...total.exercise, loadMode: "per_hand" },
    load: 15,
    reps: 10,
  });
  const timed = setFixture({
    exercise: { ...total.exercise, loadMode: "timed" },
    reps: 999,
    seconds: 60,
  });
  const days = volumeDays(
    [
      sessionFixture({ sets: [total, hand] }),
      sessionFixture({ sets: [setFixture({ reps: 5 }), timed] }),
    ],
    owner,
    "2026-10-04",
    "28",
  );
  expect(days).toHaveLength(1);
  expect(days[0]).toMatchObject({
    workingRows: 4,
    reps: 17,
    seconds: 60,
    volumeRows: 2,
  });
  expect(days[0]!.volume).toBeCloseTo(109.0718474, 7);
  expect(
    volumeDays(
      [sessionFixture({ sets: [hand] })],
      owner,
      "2026-10-04",
      "all",
      conditionKey(hand),
    )[0]!.volume,
  ).toBe(150);
});
it("같은 운동의 kg/lb는 비교하고 이름/분류/장비/mode/좌우 변경은 분리한다", () => {
  const original = setFixture();
  const changes = [
    setFixture({ exercise: { ...original.exercise, id: "other-exercise" } }),
    setFixture({ exercise: { ...original.exercise, name: "이름 변경" } }),
    setFixture({ exercise: { ...original.exercise, group: "등" } }),
    setFixture({ exercise: { ...original.exercise, equipment: "장비 변경" } }),
    setFixture({ exercise: { ...original.exercise, loadMode: "machine" } }),
    setFixture({ side: "left" }),
    setFixture({ side: "right" }),
  ];
  const sessions = [
    sessionFixture({
      sets: [
        original,
        setFixture({ unit: "lb", load: 10, reps: 2 }),
        ...changes,
      ],
    }),
  ];
  expect(volumeConditions(sessions, owner, "2026-10-04")).toHaveLength(8);
  const selected = volumeDays(
    sessions,
    owner,
    "2026-10-04",
    "all",
    conditionKey(original),
  )[0]!;
  expect(selected.workingRows).toBe(2);
  expect(selected.volume).toBeCloseTo(209.0718474, 7);
});
it("기록된 0과 N/A를 구분하고 맨몸/보조/시간을 중량 합계에 넣지 않는다", () => {
  const zero = setFixture({ load: 0 });
  expect(totalSets([zero]).volume).toBe(0);
  expect(
    totalSets([
      setFixture({
        exercise: { ...zero.exercise, loadMode: "machine" },
        load: 30,
        reps: 8,
      }),
    ]).volume,
  ).toBe(240);
  for (const loadMode of ["bodyweight", "assisted", "timed"] as const) {
    const set = setFixture({
      exercise: { ...zero.exercise, loadMode },
      load: loadMode === "bodyweight" ? null : 0,
      seconds: 40,
    });
    expect(totalSets([set]).volume).toBeNull();
    expect(totalSets([set]).volumeRows).toBe(0);
  }
  expect(totalSets([setFixture({ completedAt: null, load: null })])).toEqual({
    workingRows: 0,
    reps: null,
    seconds: null,
    volume: null,
    volumeRows: 0,
  });
});
it("28/84/전체는 기록 localDate와 inclusive 경계로 걸러 기록 없는 날을 만들지 않는다", () => {
  const records = [
    "2026-07-12",
    "2026-07-13",
    "2026-09-06",
    "2026-09-07",
    "2026-10-04",
    "2026-10-05",
  ].map((localDate) =>
    sessionFixture({ localDate, timeZone: "America/Los_Angeles" }),
  );
  expect(
    volumeDays(records, owner, "2026-10-04", "28").map((d) => d.date),
  ).toEqual(["2026-09-07", "2026-10-04"]);
  expect(
    volumeDays(records, owner, "2026-10-04", "84").map((d) => d.date),
  ).toEqual(["2026-07-13", "2026-09-06", "2026-09-07", "2026-10-04"]);
  expect(volumeDays(records, owner, "2026-10-04", "all")).toHaveLength(5);
  expect(shiftDate("2024-03-01", -1)).toBe("2024-02-29");
});
it("그래프 X는 날짜 간격이며 N/A에서 선을 끊고 실제 0을 점으로 남긴다", () => {
  const days = [
    sessionFixture({
      localDate: "2026-09-01",
      sets: [setFixture({ load: 0 })],
    }),
    sessionFixture({ localDate: "2026-09-02" }),
    sessionFixture({ localDate: "2026-09-11" }),
  ];
  const series = volumeDays(days, owner, "2026-10-04", "all");
  expect(trendSegments(series, "volume")[0]!.map((p) => p.x)).toEqual([
    0, 0.1, 1,
  ]);
  expect(
    trendSegments(
      [series[0]!, { ...series[1]!, volume: null }, series[2]!],
      "volume",
    ),
  ).toEqual([
    [{ date: "2026-09-01", value: 0, x: 0 }],
    [{ date: "2026-09-11", value: 200, x: 1 }],
  ]);
  expect(trendSegments([series[0]!], "volume")[0]![0]!.x).toBe(0.5);
});
it("변화율은 두 값과 0이 아닌 기준에서만 계산한다", () => {
  expect(changePercent(100, 150)).toBe(50);
  expect(changePercent(100, 0)).toBe(-100);
  expect(changePercent(0, 100)).toBeNull();
  expect(changePercent(null, 100)).toBeNull();
  expect(changePercent(100, null)).toBeNull();
});
