import { expect, it } from "vitest";
import { weeklyReport, weeklyReportFile } from "../../src/domain/weekly-report";
import {
  profileFixture,
  sessionFixture,
  setFixture,
  otherOwner,
} from "../fixtures/training";
const now = new Date("2026-10-07T03:00:00Z");
it("이번 주/지난주 같은 요일까지 owner·종료·날짜·행·중량 범위를 분리한다", () => {
  const report = weeklyReport(
    profileFixture(),
    [
      sessionFixture({
        localDate: "2026-10-05",
        sets: [
          setFixture({ load: 0 }),
          setFixture({ kind: "warmup" }),
          setFixture({ completedAt: null }),
          setFixture({
            exercise: { ...setFixture().exercise, loadMode: "per_hand" },
          }),
        ],
      }),
      sessionFixture({
        localDate: "2026-09-30",
        sets: [setFixture({ load: 100, unit: "lb" })],
      }),
      sessionFixture({ localDate: "2026-10-01" }),
      sessionFixture({
        localDate: "2026-10-06",
        status: "active",
        endedAt: null,
      }),
      sessionFixture({ localDate: "2026-10-06", status: "cancelled" }),
      sessionFixture({ localDate: "2026-10-06", deletedAt: now.toISOString() }),
      sessionFixture({ localDate: "2026-10-06", ownerId: otherOwner }),
      sessionFixture({ localDate: "2026-10-08" }),
    ],
    now,
  );
  expect(report.current).toMatchObject({
    start: "2026-10-05",
    end: "2026-10-07",
    sessions: 1,
    days: 1,
    workingRows: 2,
    volume: 0,
    volumeRows: 1,
  });
  expect(report.previous).toMatchObject({
    start: "2026-09-28",
    end: "2026-09-30",
    sessions: 1,
    volumeRows: 1,
  });
  expect(report.previous.volume).toBeCloseTo(453.59237);
  expect(report.inputs.sessions).toHaveLength(2);
  expect(
    weeklyReport(
      report.inputs.profile,
      report.inputs.sessions,
      new Date(report.generatedAt),
    ),
  ).toEqual(report);
  expect(
    report.inputs.sessions.every(
      (s) => s.ownerId !== otherOwner && s.status !== "active",
    ),
  ).toBe(true);
});
it("시간대/미입력 N/A·저장 당시 입력과 버전을 보존하며 나중 수정으로 바뀌지 않는다", () => {
  const profile = profileFixture({ timeZone: "America/Los_Angeles" });
  const session = sessionFixture({
    localDate: "2026-10-04",
    sets: [
      setFixture({
        exercise: { ...setFixture().exercise, loadMode: "bodyweight" },
      }),
    ],
  });
  const report = weeklyReport(
    profile,
    [session],
    new Date("2026-10-05T01:00:00Z"),
  );
  expect(report.current.end).toBe("2026-10-04");
  expect(report.current.volume).toBeNull();
  session.sets[0]!.load = 999;
  profile.revision++;
  expect(report.inputs.sessions[0]!.sets[0]!.load).toBe(20);
  expect(report.inputs.profile.revision).toBe(1);
  expect(report.versions).toMatchObject({
    scientificRule: null,
    evidence: [],
    muscleMapping: null,
  });
});
it("읽기 파일은 원본을 HTML로 실행하지 않으며 10MiB 초과를 자르지 않는다", async () => {
  const report = weeklyReport(
    profileFixture({ name: '<script>alert("x")</script>' }),
    [sessionFixture()],
    now,
  );
  const html = await weeklyReportFile(report).text();
  expect(html).not.toContain("<script>");
  expect(html).toContain("&lt;script&gt;");
  expect(html).toContain("default-src 'none'");
  report.inputs.profile.name = "가".repeat(4 * 1024 * 1024);
  expect(() => weeklyReportFile(report)).toThrow("10MiB");
});
