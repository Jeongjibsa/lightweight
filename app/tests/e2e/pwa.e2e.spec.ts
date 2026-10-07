import { origin, buildHeaders } from "./environment";
import { databaseSnapshot } from "./storage";
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

test("HAR-04 실제 SW v1→waiting v2: 운동 중 보류→적용·DB 보존→새 버전 offline", async ({
  page,
  context,
  request,
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
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  const marker = page.locator('meta[name="lightweight-e2e-build"]');
  await expect(marker).toHaveAttribute("content", "v1");
  await page
    .getByRole("button", { name: "진행 중인 운동 이어하기", exact: true })
    .click();
  const response = await request.post(`${origin}/__e2e/build`, {
    headers: buildHeaders("v2"),
  });
  expect(response.status()).toBe(204);
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  });
  const update = page.getByRole("button", { name: "업데이트", exact: true });
  const resume = page.getByRole("button", {
    name: "운동 마치고 업데이트",
    exact: true,
  });
  await expect(resume).toBeVisible();
  await expect(resume).toBeEnabled();
  await navigate(page, "리포트");
  await resume.click();
  await expect(
    page.getByRole("heading", { name: "운동 기록", exact: true }),
  ).toBeVisible();
  await expect(marker).toHaveAttribute("content", "v1");
  expect(
    await page.evaluate(
      async () => !!(await navigator.serviceWorker.ready).waiting,
    ),
  ).toBe(true);
  await completeSet(page);
  await endWorkout(page);
  await expect(update).toBeEnabled();
  const before = await databaseSnapshot(page);
  await page.screenshot({ path: info.outputPath("update-ready-390.png") });
  await update.click();
  await expect(marker).toHaveAttribute("content", "v2");
  expect(await databaseSnapshot(page)).toEqual(before);
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(marker).toHaveAttribute("content", "v2");
  expect(await databaseSnapshot(page)).toEqual(before);
  await context.setOffline(false);
  const data = (await downloadBackup(page)).data;
  expect(data.sessions).toHaveLength(1);
  expect(data.sessions[0]!.sets[0]).toMatchObject({ load: 20, reps: 8 });
});
