import { test, expect } from "./fixture";
import { fixedTime } from "./environment";
import {
  configure,
  navigate,
  startRoutine,
  completeSet,
  endWorkout,
  downloadBackup,
} from "./helpers";

test("운동 접기와 스크롤 고정 타이머는 세트 입력·공유 시간·모달 focus·종료 해제를 보존한다", async ({
  page,
}, info) => {
  await page.goto("/");
  await configure(page);
  await navigate(page, "나의 루틴");
  await page.getByRole("button", { name: "루틴 만들기", exact: true }).click();
  const editor = page.getByRole("dialog", {
    name: "나의 루틴 만들기",
    exact: true,
  });
  await editor
    .getByRole("textbox", { name: "루틴 이름", exact: true })
    .fill("가짜 긴 운동 UX");
  for (const name of ["바벨 스쿼트", "바벨 벤치 프레스", "바벨 데드리프트"]) {
    await editor
      .getByRole("button", { name: `${name} 추가`, exact: true })
      .click();
    await editor
      .getByRole("spinbutton", { name: `${name} 계획 세트`, exact: true })
      .fill("3");
  }
  await editor.getByRole("button", { name: "루틴 저장", exact: true }).click();
  await expect(editor).toBeHidden();
  await startRoutine(page);
  await page.evaluate(() => scrollTo(0, 0));
  const floating = page.getByRole("region", {
    name: "고정 휴식 타이머",
    exact: true,
  });
  const timer = page.getByRole("region", {
    name: "세트 휴식 타이머",
    exact: true,
  });
  const squat = page.getByRole("button", {
    name: "바벨 스쿼트 세트 접기/펼치기",
    exact: true,
  });
  await expect(floating).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 350 });
  await expect
    .poll(() =>
      timer.evaluate(
        (element) => element.getBoundingClientRect().top >= innerHeight,
      ),
    )
    .toBe(true);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(floating).toBeVisible();
  await page.evaluate(() => scrollTo(0, 0));
  await expect(floating).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await completeSet(page);
  await squat.click();
  await expect(squat).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByRole("spinbutton", {
      name: "바벨 스쿼트 1세트 중량",
      exact: true,
    }),
  ).toBeHidden();
  await squat.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("spinbutton", {
      name: "바벨 스쿼트 1세트 중량",
      exact: true,
    }),
  ).toHaveValue("20");
  await page.getByRole("button", { name: "모두 접기", exact: true }).click();
  for (const name of ["바벨 스쿼트", "바벨 벤치 프레스", "바벨 데드리프트"]) {
    const control = page.getByRole("button", {
      name: `${name} 세트 접기/펼치기`,
      exact: true,
    });
    await expect(control).toHaveAttribute("aria-expanded", "false");
    await expect
      .poll(() =>
        control.evaluate(
          (element) =>
            document
              .getElementById(element.getAttribute("aria-controls")!)!
              .getBoundingClientRect().height,
        ),
      )
      .toBe(0);
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollHeight),
  ).toBeLessThan(1600);
  await page.screenshot({
    path: info.outputPath("workout-collapsed-390.png"),
    animations: "disabled",
    fullPage: true,
  });
  await page.getByRole("button", { name: "모두 펼치기", exact: true }).click();
  for (const control of await page
    .getByRole("button", { name: /세트 접기\/펼치기$/ })
    .all()) {
    await expect
      .poll(() =>
        control.evaluate((element) => {
          const panel = document.getElementById(
            element.getAttribute("aria-controls")!,
          )!;
          const height = panel.getBoundingClientRect().height;
          return height > 0 && height >= panel.scrollHeight - 1;
        }),
      )
      .toBe(true);
  }
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page
      .getByRole("spinbutton", {
        name: "바벨 데드리프트 3세트 중량",
        exact: true,
      })
      .scrollIntoViewIfNeeded();
    await expect(floating).toBeVisible();
    await expect(floating.getByLabel("고정 타이머 남은 시간")).toHaveText(
      "1:00",
    );
    const region = (await floating.boundingBox())!;
    expect(region.y).toBeGreaterThanOrEqual(8);
    expect(region.y + region.height).toBeLessThan(90);
    expect(region.x).toBeGreaterThanOrEqual(12);
    expect(region.x + region.width).toBeLessThanOrEqual(width - 12);
    for (const button of await floating.getByRole("button").all()) {
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      expect(
        await button.evaluate((el) => {
          const r = el.getBoundingClientRect();
          const hit = document.elementFromPoint(
            r.x + r.width / 2,
            r.y + r.height / 2,
          );
          return hit !== null && (hit === el || el.contains(hit));
        }),
      ).toBe(true);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath(`workout-floating-${width}.png`),
      animations: "disabled",
    });
  }
  await page.clock.setFixedTime(
    new Date(new Date(fixedTime).getTime() + 30000),
  );
  await expect(floating.getByLabel("고정 타이머 남은 시간")).toHaveText("0:30");
  await floating
    .getByRole("button", { name: "휴식 일시정지", exact: true })
    .click();
  await page.clock.setFixedTime(
    new Date(new Date(fixedTime).getTime() + 120000),
  );
  await expect(floating.getByLabel("고정 타이머 남은 시간")).toHaveText("0:30");
  await floating
    .getByRole("button", { name: "휴식 재개", exact: true })
    .click();
  const opener = floating.getByRole("button", {
    name: "휴식 타이머 펼치기",
    exact: true,
  });
  await opener.click();
  const controls = page.getByRole("dialog", {
    name: "세트 휴식 조작",
    exact: true,
  });
  await expect(controls.getByLabel("남은 휴식 시간")).toHaveText("0:30");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(controls).toBeVisible();
  await controls
    .getByRole("button", { name: "90초 휴식 시작", exact: true })
    .click();
  await expect(controls.getByLabel("남은 휴식 시간")).toHaveText("1:30");
  await page.screenshot({
    path: info.outputPath("workout-timer-sheet-390.png"),
    animations: "disabled",
  });
  await controls.getByRole("button", { name: "닫기", exact: true }).click();
  await expect(opener).toBeFocused();
  await expect(floating.getByLabel("고정 타이머 남은 시간")).toHaveText("1:30");
  await page.evaluate(() => scrollTo(0, 0));
  await expect(floating).toHaveCount(0);
  await expect(timer.getByLabel("남은 휴식 시간")).toHaveText("1:30");
  await page
    .getByRole("spinbutton", {
      name: "바벨 데드리프트 3세트 중량",
      exact: true,
    })
    .scrollIntoViewIfNeeded();
  await page.clock.setFixedTime(
    new Date(new Date(fixedTime).getTime() + 211000),
  );
  await expect(floating.getByText("휴식 완료", { exact: true })).toBeVisible();
  await expect(floating.getByLabel("고정 타이머 남은 시간")).toHaveText("0:00");
  await endWorkout(page);
  await expect(floating).toHaveCount(0);
  await expect(timer).toHaveCount(0);
  const saved = (await downloadBackup(page)).data.sessions[0]!;
  expect(saved.sets).toHaveLength(9);
  expect(saved.sets[0]).toMatchObject({ load: 20, reps: 8 });
  expect(saved.sets[0]!.completedAt).not.toBeNull();
});
