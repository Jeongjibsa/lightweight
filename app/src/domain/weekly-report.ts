import { dateInZone, type Profile, type Session } from "./models";
import { coverageVersion, reportCoverage } from "./report-coverage";
import {
  completedWorking,
  shiftDate,
  totalSets,
  volumeVersion,
} from "./volume";

export const weeklyReportVersion = "weekly-record-report-v1";
export function weeklyReport(profile: Profile, sessions: Session[], now: Date) {
  const end = dateInZone(now, profile.timeZone);
  const weekday = new Date(`${end}T12:00:00Z`).getUTCDay();
  const start = shiftDate(end, -((weekday + 6) % 7));
  const previousStart = shiftDate(start, -7),
    previousEnd = shiftDate(end, -7);
  const inputs = sessions.filter(
    (s) =>
      s.ownerId === profile.ownerId &&
      !s.deletedAt &&
      (s.status === "complete" || s.status === "partial") &&
      s.endedAt !== null &&
      ((s.localDate >= previousStart && s.localDate <= previousEnd) ||
        (s.localDate >= start && s.localDate <= end)),
  );
  function period(from: string, to: string) {
    const records = inputs.filter(
      (s) => s.localDate >= from && s.localDate <= to,
    );
    const completed = records.filter(
      (s) => completedWorking(s.sets).length > 0,
    );
    return {
      start: from,
      end: to,
      sessions: completed.length,
      days: new Set(completed.map((s) => s.localDate)).size,
      ...totalSets(
        records.flatMap((s) => s.sets),
        true,
      ),
    };
  }
  return structuredClone({
    version: weeklyReportVersion,
    generatedAt: now.toISOString(),
    timeZone: profile.timeZone,
    current: period(start, end),
    previous: period(previousStart, previousEnd),
    coverage: reportCoverage(profile, inputs, now),
    versions: {
      coverage: coverageVersion,
      volume: volumeVersion,
      scientificRule: null,
      muscleMapping: null,
      evidence: [],
    },
    inputs: { profile, sessions: inputs },
  });
}
export type WeeklyReport = ReturnType<typeof weeklyReport>;
const escapeHtml = (value: unknown) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

// A private, readable receipt; no scripts, remote fonts/assets or restore semantics.
export function weeklyReportFile(report: WeeklyReport) {
  const rows = [
    ["운동 횟수", report.current.sessions, report.previous.sessions],
    ["운동한 날", report.current.days, report.previous.days],
    [
      "완료 본세트 입력 행",
      report.current.workingRows,
      report.previous.workingRows,
    ],
    ["반복 수", report.current.reps ?? "N/A", report.previous.reps ?? "N/A"],
    [
      "총 중량 방식 부분합 (kg·회)",
      report.current.volume ?? "N/A",
      report.previous.volume ?? "N/A",
    ],
    ["볼륨 포함 행", report.current.volumeRows, report.previous.volumeRows],
  ];
  const html = `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"><title>내 주간 운동 리포트</title><style>body{font-family:system-ui,sans-serif;max-width:760px;margin:32px auto;padding:0 20px;line-height:1.6}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{text-align:left;overflow-wrap:anywhere;padding:12px;border-bottom:1px solid #ccc}pre{white-space:pre-wrap;overflow-wrap:anywhere}small{color:#555}</style><h1>내 주간 운동 리포트</h1><p>${escapeHtml(report.current.start)}–${escapeHtml(report.current.end)} · ${escapeHtml(report.timeZone)}</p><p>지난주 같은 요일까지: ${escapeHtml(report.previous.start)}–${escapeHtml(report.previous.end)}</p><table><thead><tr><th>기록 지표</th><th>이번 주</th><th>지난주 같은 기간</th></tr></thead><tbody>${rows.map((row) => `<tr>${row.map((v) => `<td>${escapeHtml(v)}</td>`).join("")}</tr>`).join("")}</tbody></table><p>종료한 운동의 완료 본세트를 집계했습니다. 총 중량 방식만 볼륨 부분합에 포함하며 N/A는 0이 아닙니다. 좌우 별도 입력은 각각 세고 기록 없는 날은 쉬었다고 판단하지 않습니다. 근육 성장·최적 볼륨 평가와 자동 증량 처방은 제공하지 않습니다.</p><small>저장 시점 ${escapeHtml(report.generatedAt)} · 계산 ${escapeHtml(report.version)}. 이 파일은 개인 기록을 포함합니다. 백업 복원 파일과는 별개이며 나중에 기록을 수정해도 이 파일은 그대로 유지됩니다.</small><details><summary>계산 기준과 저장 당시 입력</summary><pre>${escapeHtml(JSON.stringify(report, null, 2))}</pre></details></html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  if (blob.size > 10 * 1024 * 1024)
    throw new Error(
      "리포트 파일이 10MiB를 초과해 저장하지 못했어요. 기록을 자르지 않고 중단했습니다.",
    );
  return blob;
}
