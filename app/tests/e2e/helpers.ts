import { expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import type { Backup } from "../../src/domain/models";

export async function navigate(page: Page, name: string) {
  await page
    .getByRole("navigation", { name: "주 메뉴" })
    .getByRole("link", { name, exact: true })
    .click();
}
export async function choose(page: Page, label: string, option: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}
export async function configure(
  page: Page,
  name = "가짜 E2E 프로필 A",
  unit = "kg",
  split = "무분할",
) {
  await navigate(page, "설정");
  await page
    .getByRole("textbox", { name: "프로필 이름", exact: true })
    .fill(name);
  await page.getByRole("radio", { name: "근육량 증대", exact: true }).check();
  await choose(page, "최소 횟수", "3회");
  await choose(page, "최대 횟수", "4회");
  await choose(page, "분할 방법", split);
  await page.getByRole("checkbox", { name: "바벨", exact: true }).check();
  await choose(page, "중량 단위", unit);
  await page
    .getByRole("button", { name: "훈련 설정 저장", exact: true })
    .click();
  await expect(
    page.getByText("훈련 설정을 이 기기에 저장했습니다.", { exact: true }),
  ).toBeVisible();
}
export async function createRoutine(page: Page, name = "가짜 E2E 전신 A") {
  await navigate(page, "나의 루틴");
  await page.getByRole("button", { name: "루틴 만들기", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "나의 루틴 만들기",
    exact: true,
  });
  await dialog
    .getByRole("textbox", { name: "루틴 이름", exact: true })
    .fill(name);
  await dialog
    .getByRole("button", { name: "바벨 스쿼트 추가", exact: true })
    .click();
  await dialog
    .getByRole("spinbutton", { name: "바벨 스쿼트 계획 세트", exact: true })
    .fill("1");
  await dialog.getByRole("button", { name: "루틴 저장", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
}
export async function startRoutine(page: Page) {
  await navigate(page, "나의 루틴");
  await page
    .getByRole("button", { name: "이 루틴으로 시작", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "운동 마치기", exact: true }),
  ).toBeVisible();
}
export async function completeSet(
  page: Page,
  index = 1,
  load = "20",
  reps = "8",
) {
  await page
    .getByRole("spinbutton", {
      name: `바벨 스쿼트 ${index}세트 중량`,
      exact: true,
    })
    .fill(load);
  await page
    .getByRole("spinbutton", {
      name: `바벨 스쿼트 ${index}세트 횟수`,
      exact: true,
    })
    .fill(reps);
  await page
    .getByRole("button", { name: `바벨 스쿼트 ${index}세트 완료`, exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: `바벨 스쿼트 ${index}세트 완료 취소`,
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
}
export async function endWorkout(page: Page) {
  await page.getByRole("button", { name: "운동 마치기", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "오늘 운동을 마칠까요?",
    exact: true,
  });
  await dialog
    .getByRole("button", { name: "완료 기록 저장", exact: true })
    .click();
  await expect(dialog).toBeHidden();
}
export async function downloadBackup(page: Page) {
  await navigate(page, "설정");
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "현재 프로필 백업", exact: true })
    .click();
  const file = await download;
  const path = await file.path();
  if (!path) throw new Error("Synthetic backup download missing");
  const bytes = await readFile(path);
  const text =
    bytes[0] === 0x1f && bytes[1] === 0x8b
      ? gunzipSync(bytes).toString("utf8")
      : bytes.toString("utf8");
  const data = JSON.parse(text) as Backup;
  expect(data.format).toBe("lightweight-backup");
  expect(data.version).toBe(1);
  return {
    path,
    data,
    filename: file.suggestedFilename(),
    bytes: bytes.byteLength,
  };
}
// Only ownership remapping and the profile's restore revision/time are excluded.
// IDs, set values, deletion state and routine/session snapshots must remain equal.
export function normalizeBackup(data: Backup) {
  const {
    ownerId: _owner,
    revision: _revision,
    updatedAt: _updated,
    ...profile
  } = data.profile;
  const routines = data.routines
    .map(({ ownerId: _owner, ...record }) => record)
    .sort((a, b) => a.id.localeCompare(b.id));
  const sessions = data.sessions
    .map(({ ownerId: _owner, ...record }) => {
      const { routineSnapshot } = record;
      if (!routineSnapshot) return record;
      const { ownerId: _snapshotOwner, ...snapshot } = routineSnapshot;
      return { ...record, routineSnapshot: snapshot };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  return {
    format: data.format,
    version: data.version,
    profile,
    routines,
    sessions,
  };
}
