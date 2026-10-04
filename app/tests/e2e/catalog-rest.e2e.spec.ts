import { test, expect } from "./fixture";
import { fixedTime } from "./environment";
import {
  choose,
  configure,
  completeSet,
  createRoutine,
  startRoutine,
  navigate,
  downloadBackup,
} from "./helpers";

test("새 바벨 종목과 어깨 세부 분류는 검색/전환하며 기존 기록 분류를 보존한다", async ({
  page,
}, info) => {
  await page.goto("/");
  await configure(page);
  await navigate(page, "운동 탐색");
  await choose(page, "장비", "바벨");
  for (const name of ["바벨 스쿼트", "바벨 벤치 프레스", "바벨 데드리프트"])
    await expect(
      page.getByRole("button", { name: `${name} 추가`, exact: true }),
    ).toBeVisible();
  await choose(page, "장비", "전체");
  await page.getByRole("button", { name: "어깨", exact: true }).click();
  await choose(page, "세부 부위", "후면");
  await expect(
    page.getByRole("button", {
      name: "덤벨 벤트오버 레터럴 레이즈 추가",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "덤벨 프론트 레이즈 추가", exact: true }),
  ).toHaveCount(0);
  await choose(page, "세부 부위", "전면");
  await expect(
    page.getByRole("button", { name: "덤벨 프론트 레이즈 추가", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "팔", exact: true }).click();
  await expect(
    page.getByRole("combobox", { name: "세부 부위", exact: true }),
  ).toHaveValue("전체");
  await page.getByRole("button", { name: "어깨", exact: true }).click();
  await choose(page, "세부 부위", "측면");
  await page.getByRole("textbox", { name: "운동 검색" }).fill("비하인드");
  await expect(
    page.getByRole("button", {
      name: "케이블 비하인드백 레터럴 레이즈 추가",
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({
    path: info.outputPath("shoulder-regions.png"),
    fullPage: true,
  });
});

test("완료 세트의 1분 휴식·즐겨찾기·pause/reload/새 완료와 설정 backup을 보존한다", async ({
  page,
}, info) => {
  await page.goto("/");
  await configure(page);
  await createRoutine(page);
  await startRoutine(page);
  const timer = page.getByRole("region", { name: "세트 휴식 타이머" });
  await expect(timer.getByLabel("남은 휴식 시간")).toHaveText("1:00");
  await completeSet(page);
  await expect(timer.getByRole("status")).toHaveText("휴식 중");
  await page.clock.setFixedTime(
    new Date(new Date(fixedTime).getTime() + 30000),
  );
  await expect(timer.getByLabel("남은 휴식 시간")).toHaveText("0:30");
  await timer
    .getByRole("button", { name: "휴식 일시정지", exact: true })
    .click();
  await page.clock.setFixedTime(
    new Date(new Date(fixedTime).getTime() + 120000),
  );
  await expect(timer.getByLabel("남은 휴식 시간")).toHaveText("0:30");
  await page.reload();
  await page
    .getByRole("button", { name: "진행 중인 운동 이어하기", exact: true })
    .click();
  await expect(timer.getByRole("status")).toHaveText("일시정지");
  await timer
    .getByRole("button", { name: "120초 휴식 시작", exact: true })
    .click();
  await expect(timer.getByLabel("남은 휴식 시간")).toHaveText("2:00");
  await timer
    .getByRole("button", { name: "즐겨찾기 편집", exact: true })
    .click();
  const modal = page.getByRole("dialog", {
    name: "휴식 즐겨찾기",
    exact: true,
  });
  await modal
    .getByRole("textbox", { name: "즐겨찾기 1 · 초", exact: true })
    .fill("45");
  await page.setViewportSize({ width: 320, height: 844 });
  await page.screenshot({
    path: info.outputPath("rest-favorites-320.png"),
    animations: "disabled",
  });
  await modal
    .getByRole("button", { name: "즐겨찾기 저장", exact: true })
    .click();
  await expect(modal).toBeHidden();
  await expect(
    timer.getByRole("button", { name: "45초 휴식 시작", exact: true }),
  ).toBeVisible();
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const buttons = timer.getByRole("button");
    for (const button of await buttons.all())
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await timer.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: info.outputPath(`rest-${width}.png`),
      animations: "disabled",
    });
  }
  await page.getByRole("button", { name: "세트 추가", exact: true }).click();
  await completeSet(page, 2, "25", "6");
  await expect(timer.getByLabel("남은 휴식 시간")).toHaveText("2:00");
  const backup = (await downloadBackup(page)).data;
  expect(backup.profile.restTimer).toEqual({
    seconds: 120,
    favorites: [45, 90, 120, 180],
  });
  expect(backup.sessions[0]!.sets[0]).toMatchObject({ load: 20, reps: 8 });
});

test("다섯 메뉴의 제목 focus는 보존하고 파란 outline 없이 좁은 화면을 제공한다", async ({
  page,
}, info) => {
  await page.goto("/");
  await configure(page);
  for (const name of ["오늘", "운동 탐색", "나의 루틴", "리포트", "설정"]) {
    await navigate(page, name);
    const title = page.getByRole("heading", { name, exact: true, level: 1 });
    await expect(title).toBeFocused();
    expect(await title.evaluate((e) => getComputedStyle(e).outlineStyle)).toBe(
      "none",
    );
    await page.setViewportSize({ width: 320, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath(`heading-${name}.png`),
      animations: "disabled",
    });
  }
});
