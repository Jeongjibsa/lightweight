import { readFile } from "node:fs/promises";
import { test, expect } from "./fixture";
import {
  configure,
  createRoutine,
  startRoutine,
  completeSet,
  endWorkout,
  navigate,
} from "./helpers";

test("REP 저장 시점: 주간 비교→읽기 파일→기록 보존", async ({
  page,
  context,
  diagnostics,
}, info) => {
  await page.goto("/");
  await configure(page);
  await createRoutine(page);
  await startRoutine(page);
  await completeSet(page);
  await endWorkout(page);
  await navigate(page, "리포트");
  const section = page.getByRole("region", { name: "지난주와 비교" });
  await expect(section.getByRole("row", { name: /볼륨 부분합/ })).toContainText(
    "160 kg·회",
  );
  const downloaded = page.waitForEvent("download");
  await section.getByRole("button", { name: "리포트 파일 저장" }).click();
  const file = await downloaded;
  expect(file.suggestedFilename()).toBe("lightweight-report-2026-10-04.html");
  const html = await readFile((await file.path())!, "utf8");
  expect(html).toContain("weekly-record-report-v1");
  expect(html).toContain("record-volume-v2");
  expect(html).not.toContain("<script");
  const notice = page.getByRole("button", { name: "알림 닫기", exact: true });
  if (await notice.isVisible()) await notice.click();
  await section.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("weekly-comparison-390.png") });
  const reader = await context.newPage();
  diagnostics(reader);
  await reader.setContent(html);
  await expect(
    reader.getByRole("heading", { name: "내 주간 운동 리포트", exact: true }),
  ).toBeVisible();
  await expect(
    reader.getByRole("row", { name: /총 중량 방식 부분합/ }),
  ).toContainText("160");
  await reader.screenshot({ path: info.outputPath("saved-report-390.png") });
  await reader.close();
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await section.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("weekly-comparison-320.png") });
  await page.reload();
  await expect(
    page
      .getByRole("region", { name: "지난주와 비교" })
      .getByRole("row", { name: /볼륨 부분합/ }),
  ).toContainText("160 kg·회");
});
