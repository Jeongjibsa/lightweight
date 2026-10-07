import { test, expect } from "./fixture";
import {
  configure,
  navigate,
  choose,
  endWorkout,
  downloadBackup,
} from "./helpers";

test("추가 종목은 장비/부위 검색부터 맨몸 완료·재실행·백업까지 중량 기준을 보존한다", async ({
  page,
}, info) => {
  await page.goto("/");
  await configure(page);
  const names = ["스미스머신 스쿼트", "덤벨 인클라인 벤치 프레스", "딥스"];
  for (const [index, equipment, group, region, query] of [
    [0, "머신", "하체", "허벅지 앞쪽", "스미스 스쿼트"],
    [1, "덤벨", "가슴", "상부", "인클라인 덤벨"],
    [2, "맨몸", "가슴", "하부", "평행봉"],
  ] as const) {
    await navigate(page, "운동 탐색");
    await page.getByRole("button", { name: group, exact: true }).click();
    await choose(page, "세부 부위", region);
    await choose(page, "장비", equipment);
    await page.getByRole("textbox", { name: "운동 검색" }).fill(query);
    await page
      .getByRole("button", { name: `${names[index]} 추가`, exact: true })
      .click();
    await navigate(page, "오늘");
    const resume = page.getByRole("button", {
      name: "진행 중인 운동 이어하기",
      exact: true,
    });
    if (await resume.isVisible()) await resume.click();
    await expect(
      page.getByRole("button", {
        name: `${names[index]} 세트 접기/펼치기`,
        exact: true,
      }),
    ).toBeVisible();
  }
  for (const [index, load, reps] of [
    [0, "70", "10"],
    [1, "25", "8"],
    [2, "", "12"],
  ] as const) {
    const prefix = `${names[index]} 1세트`;
    if (load)
      await page
        .getByRole("spinbutton", { name: `${prefix} 중량`, exact: true })
        .fill(load);
    await page
      .getByRole("spinbutton", { name: `${prefix} 횟수`, exact: true })
      .fill(reps);
    await page
      .getByRole("button", { name: `${prefix} 완료`, exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: `${prefix} 완료 취소`, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  }
  await page.reload();
  await page
    .getByRole("button", { name: "진행 중인 운동 이어하기", exact: true })
    .click();
  await expect(
    page.getByRole("spinbutton", {
      name: "덤벨 인클라인 벤치 프레스 1세트 중량",
      exact: true,
    }),
  ).toHaveValue("25");
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of names.slice(0, 2)) {
    const control = page.getByRole("button", {
      name: `${name} 세트 접기/펼치기`,
      exact: true,
    });
    await control.click();
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
  await page
    .getByRole("spinbutton", { name: "딥스 1세트 중량", exact: true })
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(
    page.getByRole("region", { name: "고정 휴식 타이머" }),
  ).toBeVisible();
  await page.screenshot({
    path: info.outputPath("new-exercises-workout.png"),
    fullPage: false,
  });
  await endWorkout(page);
  const { data } = await downloadBackup(page);
  expect(data.sessions).toHaveLength(1);
  expect(data.sessions[0]!.sets).toHaveLength(9);
  expect(
    data.sessions[0]!.sets.filter((set) => set.completedAt).map((set) => [
      set.exercise.id,
      set.exercise.loadMode,
      set.load,
      set.reps,
      !!set.completedAt,
    ]),
  ).toEqual([
    ["smith-squat", "machine", 70, 10, true],
    ["dumbbell-incline-bench", "per_hand", 25, 8, true],
    ["dips", "bodyweight", null, 12, true],
  ]);
  expect(data.sessions[0]!.sets.filter((set) => !set.completedAt)).toHaveLength(
    6,
  );
});
