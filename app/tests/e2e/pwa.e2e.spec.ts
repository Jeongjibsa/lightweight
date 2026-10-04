import { test, expect } from "./fixture";
import {
  completeSet,
  configure,
  createRoutine,
  downloadBackup,
  endWorkout,
  navigate,
  startRoutine,
} from "./helpers";

test("E2E-02 Chromium:실제 SW→오프라인 reload/2세트 저장→재연결/단일 기록", async ({
  page,
  context,
}, info) => {
  await page.goto("/");
  await configure(page);
  await createRoutine(page);
  await startRoutine(page);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect
    .poll(() =>
      page.evaluate(() => navigator.serviceWorker.controller?.scriptURL),
    )
    .toMatch(/\/sw\.js$/);
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  expect(await page.evaluate(() => navigator.onLine)).toBe(false);
  await page
    .getByRole("button", { name: "진행 중인 운동 이어하기", exact: true })
    .click();
  await completeSet(page);
  await page.getByRole("button", { name: "세트 추가", exact: true }).click();
  await completeSet(page, 2, "0", "10");
  await endWorkout(page);
  await navigate(page, "리포트");
  await page.screenshot({ path: info.outputPath("offline-report-390.png") });
  await context.setOffline(false);
  await page.reload();
  const { data } = await downloadBackup(page);
  expect(data.sessions).toHaveLength(1);
  expect(data.sessions[0]!.status).toBe("complete");
  expect(data.sessions[0]!.sets).toHaveLength(2);
  expect(
    data.sessions[0]!.sets.map((s) => [s.load, s.reps, !!s.completedAt]),
  ).toEqual([
    [20, 8, true],
    [0, 10, true],
  ]);
  expect(new Set(data.sessions[0]!.sets.map((s) => s.id)).size).toBe(2);
});
