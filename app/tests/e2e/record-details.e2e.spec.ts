import { test, expect } from "./fixture";
import {
  configure,
  createRoutine,
  startRoutine,
  completeSet,
  endWorkout,
  navigate,
  choose,
  downloadBackup,
  normalizeBackup,
} from "./helpers";

test("메모/조건 전체·개별 저장→종료/reload→추이 분리→빈 context backup 복원을 보존한다", async ({
  page,
  browser,
  diagnostics,
}, info) => {
  await page.goto("/");
  await configure(page);
  await createRoutine(page);
  await startRoutine(page);
  await page
    .getByRole("button", { name: "운동 메모 추가", exact: true })
    .click();
  let dialog = page.getByRole("dialog", { name: "운동 메모", exact: true });
  await dialog
    .getByLabel("오늘 운동 메모", { exact: true })
    .fill("가짜 컨디션 메모\n다음에도 확인");
  await page.setViewportSize({ width: 320, height: 844 });
  await page.screenshot({
    path: info.outputPath("note-editor-320.png"),
    animations: "disabled",
  });
  await dialog.getByRole("button", { name: "메모 저장", exact: true }).click();
  await expect(dialog).toBeHidden();
  await page
    .getByRole("button", { name: "바벨 스쿼트 비교 조건", exact: true })
    .click();
  dialog = page.getByRole("dialog", { name: "운동 비교 조건", exact: true });
  await dialog
    .getByLabel("장비 이름 · 선택", { exact: true })
    .fill("가짜 랙 A");
  await dialog.getByLabel("가동범위 · 선택", { exact: true }).fill("평소 범위");
  await page.screenshot({
    path: info.outputPath("condition-editor-320.png"),
    animations: "disabled",
  });
  await dialog.getByRole("button", { name: "조건 저장", exact: true }).click();
  await expect(dialog).toBeHidden();
  await completeSet(page);
  await page.getByRole("button", { name: "세트 추가", exact: true }).click();
  await completeSet(page, 2, "30", "6");
  await endWorkout(page);
  // Open the ended record through the report's existing route.
  await navigate(page, "리포트");
  await page
    .getByRole("button", { name: /자유 운동|가짜 E2E 전신 A/ })
    .first()
    .click();
  await page
    .getByRole("button", { name: "바벨 스쿼트 비교 조건", exact: true })
    .click();
  await choose(page, "적용할 세트", "2세트 · 완료");
  dialog = page.getByRole("dialog", { name: "운동 비교 조건", exact: true });
  await dialog
    .getByLabel("장비 이름 · 선택", { exact: true })
    .fill("가짜 랙 B");
  await dialog.getByRole("button", { name: "조건 저장", exact: true }).click();
  await expect(dialog).toBeHidden();
  const saved = await downloadBackup(page);
  expect(saved.data.sessions[0]!.note).toBe("가짜 컨디션 메모\n다음에도 확인");
  expect(
    saved.data.sessions[0]!.sets.map((s) => s.comparison?.equipmentLabel),
  ).toEqual(["가짜 랙 A", "가짜 랙 B"]);
  await page.reload();
  await navigate(page, "리포트");
  await page
    .getByRole("combobox", { name: "비교할 기록", exact: true })
    .click();
  const options = page.getByRole("option");
  await expect(options).toHaveCount(3);
  await options.filter({ hasText: "가짜 랙 A" }).click();
  const table = page.getByRole("table", { name: /날짜별 완료 본세트 기록/ });
  await expect(table).toContainText("160");
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath(`condition-report-${width}.png`),
      animations: "disabled",
      fullPage: true,
    });
  }
  const context = await browser.newContext();
  try {
    const restored = await context.newPage();
    diagnostics(restored);
    await restored.goto("/");
    await navigate(restored, "설정");
    await restored
      .getByLabel("백업 파일 선택", { exact: true })
      .setInputFiles(saved.path);
    await restored
      .getByRole("dialog", { name: "백업을 복원할까요?", exact: true })
      .getByRole("button", { name: "현재 프로필에 복원", exact: true })
      .click();
    await expect(restored.getByRole("dialog")).toBeHidden();
    expect(normalizeBackup((await downloadBackup(restored)).data)).toEqual(
      normalizeBackup(saved.data),
    );
  } finally {
    await context.close();
  }
});
